import { usePage } from '@inertiajs/react';

import { IsotipoVmMax } from '@/components/logo-vm-max';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="vm-degradado flex aspect-square size-8 items-center justify-center rounded-md">
                {/* El isotipo va en blanco sobre el degradado de la marca. */}
                <IsotipoVmMax className="w-5" blanco />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
