import { SignIn } from '@clerk/nextjs'

export function generateStaticParams() {
	return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

const SignInPage = () => {
	return (
		<main className='flex-center h-screen w-full'>
			<SignIn />
		</main>
	)
}

export default SignInPage
