import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Auth = () => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <div className="flex justify-center gap-16">
                    {/* Register Column */}
                    <div className="w-1/2">
                        <h2 className="text-2xl font-bold text-theme-primary mb-4">register</h2>
                        <SignUp
                            path="/sign-up"
                            routing="path"
                            appearance={{
                                elements: {
                                    formButtonPrimary: 'bg-theme-primary text-theme-bg',
                                    formFieldInput: 'bg-theme-secondary text-theme-text',
                                },
                            }}
                        />
                    </div>

                    {/* Login Column */}
                    <div className="w-1/2">
                        <h2 className="text-2xl font-bold text-theme-primary mb-4">login</h2>
                        <SignIn
                            path="/sign-in"
                            routing="path"
                            appearance={{
                                elements: {
                                    formButtonPrimary: 'bg-theme-primary text-theme-bg',
                                    formFieldInput: 'bg-theme-secondary text-theme-text',
                                    socialButtonsBlockButton: 'bg-theme-secondary text-theme-text',
                                },
                            }}
                        />
                    </div>
                </div>
            </SignedOut>
        </div>
    );
};

export default Auth;