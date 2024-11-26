import LoginModal from '@/app/components/LoginModal';

export default function SignIn() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <LoginModal 
                isOpen={true} 
                onClose={() => {}} 
                isStandalone={true} 
            />
        </div>
    );
}
