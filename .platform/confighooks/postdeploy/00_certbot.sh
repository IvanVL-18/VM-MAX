#!/bin/bash
# Certificado HTTPS gratuito (Let's Encrypt) para Elastic Beanstalk.
#
# Lee el dominio de las "Propiedades del entorno" de Beanstalk:
#   DOMINIO     -> ej. vm-connect.com.mx   (sin www, sin https://)
#   CORREO_SSL  -> correo para avisos de Let's Encrypt (opcional)
#
# Si DOMINIO no existe o todavía no apunta a la IP de esta instancia,
# no hace nada y el sitio sigue en HTTP (el deploy NO falla).
# Para cambiar de dominio: cambia DOMINIO en la consola y aplica.

log() { echo "[https] $*"; }

DOMINIO=$(/opt/elasticbeanstalk/bin/get-config environment -k DOMINIO 2>/dev/null)
CORREO=$(/opt/elasticbeanstalk/bin/get-config environment -k CORREO_SSL 2>/dev/null)

if [ -z "$DOMINIO" ]; then
  log "No hay propiedad DOMINIO; se omite el certificado."
  exit 0
fi

TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60")
IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)
resuelve() { getent ahostsv4 "$1" | awk '{print $1; exit}'; }

if [ "$(resuelve "$DOMINIO")" != "$IP" ]; then
  log "$DOMINIO todavía no apunta a $IP; se omite el certificado."
  exit 0
fi

NOMBRES=("$DOMINIO")
if [ "$(resuelve "www.$DOMINIO")" = "$IP" ]; then
  NOMBRES+=("www.$DOMINIO")
fi

# server_name dentro del bloque de nginx de Beanstalk para que certbot lo encuentre
CONF=/etc/nginx/conf.d/elasticbeanstalk/00_dominio.conf
echo "server_name ${NOMBRES[*]};" > "$CONF"
if ! nginx -t >/dev/null 2>&1; then
  rm -f "$CONF"
  log "nginx rechazó server_name; se omite el certificado."
  exit 0
fi
systemctl reload nginx

# Instala certbot (solo la primera vez en esta instancia)
if [ ! -x /opt/certbot/bin/certbot ]; then
  log "Instalando certbot..."
  dnf install -y python3 python3-pip augeas-libs cronie || { log "No se pudo instalar dependencias."; exit 0; }
  python3 -m venv /opt/certbot \
    && /opt/certbot/bin/pip install --upgrade pip \
    && /opt/certbot/bin/pip install certbot certbot-nginx \
    || { log "No se pudo instalar certbot."; exit 0; }
  ln -sf /opt/certbot/bin/certbot /usr/bin/certbot
fi

DOMS=()
for n in "${NOMBRES[@]}"; do DOMS+=(-d "$n"); done
if [ -n "$CORREO" ]; then MAIL=(-m "$CORREO"); else MAIL=(--register-unsafely-without-email); fi

# Pide el certificado (o reutiliza el vigente) y redirige HTTP -> HTTPS
if certbot --nginx -n --agree-tos "${MAIL[@]}" "${DOMS[@]}" \
     --redirect --keep-until-expiring --expand; then
  log "HTTPS activo para: ${NOMBRES[*]}"
else
  log "certbot falló; revisa /var/log/letsencrypt/letsencrypt.log"
  exit 0
fi

# Renovación automática dos veces al día
echo '0 3,15 * * * root /opt/certbot/bin/certbot renew -q --deploy-hook "systemctl reload nginx"' > /etc/cron.d/certbot-renew
systemctl enable --now crond >/dev/null 2>&1
exit 0
