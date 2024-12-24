import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/hooks";

export function SuccessPage() {
    const auth = useAuth();

    if (auth.isLoading) {
        return <div />;
    }

    return (
        <PrivateRoute>
            <div>
                <text >Welcome {auth.username}!!</text>
                <text >Login Succeed🎉</text>
                <button
                    onClick={() => auth.handleSignOut()}
                >
                    Log out
                </button>
            </div>
        </PrivateRoute>
    );
}