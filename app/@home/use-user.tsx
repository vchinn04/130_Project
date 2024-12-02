import { useUser } from '@clerk/nextjs';

export const UserProfile = () => {
    const { isSignedIn, user, isLoaded } = useUser()

    if (!isLoaded) return null

    if (!isSignedIn) return null

    if (!user) return <div>Loading...</div>

    return (JSON.stringify(user.publicMetadata));
};