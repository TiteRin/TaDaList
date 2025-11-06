export default function Home() {
    return (
        <div className="lg:border-base-content/5 mb-16 rounded-2xl lg:border lg:p-4">
            <div className="border-base-content/10 overflow-hidden rounded-lg border-[0.5px]">
                <div className="grid grid-cols-1">
                    <div
                        className="bg-primary text-primary-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Primary
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#55828B</div>
                    </div>
                    <div
                        className="bg-secondary text-secondary-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Secondary
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#BDD358</div>
                    </div>
                    <div
                        className="bg-accent text-accent-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Accent
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#E5E059</div>
                    </div>
                    <div
                        className="bg-neutral text-neutral-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Neutral
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#303036</div>
                    </div>
                </div>
            </div>
            <div className="border-base-content/10 mt-4 overflow-hidden rounded-lg border-[0.5px]">
                <div className="grid xl:grid-cols-3">
                    <div
                        className="bg-base-100 text-base-content group border-base-content/10 grid h-36 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Base
                            100
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#F5F5F5</div>
                    </div>
                    <div
                        className="bg-base-200 text-base-content group border-base-content/10 grid h-36 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Base
                            200
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#EAEAEA</div>
                    </div>
                    <div
                        className="bg-base-300 text-base-content group border-base-content/10 grid h-36 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Base
                            300
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#DADADA</div>
                    </div>
                </div>
            </div>
            <div className="border-base-content/10 mt-4 overflow-hidden rounded-lg border-[0.5px]">
                <div className="grid xl:grid-cols-4">
                    <div
                        className="bg-info text-info-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Info
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#4A90E2</div>
                    </div>
                    <div
                        className="bg-success text-success-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Success
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#7FB069</div>
                    </div>
                    <div
                        className="bg-warning text-warning-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Warning
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#E6B800</div>
                    </div>
                    <div
                        className="bg-error text-error-content group border-base-content/10 grid h-24 place-content-end gap-1 p-6 text-end">
                        <div
                            className="font-title translate-y-1 text-sm font-semibold tracking-widest opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Error
                        </div>
                        <div className="font-mono text-[0.625rem] tracking-widest tabular-nums">#D94E41</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
