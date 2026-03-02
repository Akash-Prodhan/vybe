export default function AdminPage() {
    return (
        <div className="max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
            <p className="text-secondary text-sm mb-6">
                Welcome to the Vybe admin panel. This area is reserved for admin users.
            </p>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="card p-5">
                    <h3 className="font-semibold text-sm mb-1">Content Moderation</h3>
                    <p className="text-xs text-secondary">Review and manage posts and comments across the platform.</p>
                    <span className="inline-block mt-3 text-xs text-secondary/50">Coming soon</span>
                </div>

                <div className="card p-5">
                    <h3 className="font-semibold text-sm mb-1">User Management</h3>
                    <p className="text-xs text-secondary">Manage user accounts, roles, and permissions.</p>
                    <span className="inline-block mt-3 text-xs text-secondary/50">Coming soon</span>
                </div>

                <div className="card p-5">
                    <h3 className="font-semibold text-sm mb-1">Reports</h3>
                    <p className="text-xs text-secondary">View flagged content and user reports.</p>
                    <span className="inline-block mt-3 text-xs text-secondary/50">Coming soon</span>
                </div>

                <div className="card p-5">
                    <h3 className="font-semibold text-sm mb-1">Analytics</h3>
                    <p className="text-xs text-secondary">Platform usage statistics and trends.</p>
                    <span className="inline-block mt-3 text-xs text-secondary/50">Coming soon</span>
                </div>
            </div>
        </div>
    );
}
