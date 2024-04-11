import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
	return (
		<main className='flex-center h-screen w-full'>
			<SignUp />
		</main>
	)
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: false,
	}
}

export default SignUpPage
