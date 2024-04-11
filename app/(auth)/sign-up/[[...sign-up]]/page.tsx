import { SignUp } from '@clerk/nextjs'

export function generateStaticParams() {
	return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

const SignUpPage = () => {
	return (
		<main className='flex-center h-screen w-full'>
			<SignUp />
		</main>
	)
}

export default SignUpPage
