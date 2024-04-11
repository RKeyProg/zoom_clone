import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
	return (
		<main className='flex-center h-screen w-full'>
			<SignIn />
		</main>
	)
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: false,
	}
}

export default SignInPage
