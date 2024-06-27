import {  useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useToast,
  VStack,
  type IconButtonProps,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

import mojaloopLogo from '../../assets/mojaloop-logo.png'
import { loginSchema, type LoginForm } from '../../lib/validations/login'
import { CustomButton } from '../../components/ui'
import { FormInput } from '../../components/form'
import { login, verifyCode } from '../../api/auth'
import { TwoFactorAuthCodeForm, TwoFactorAuthCodeSchema } from '../../lib/validations/twoFactorAuthCode'
import Cookies from 'universal-cookie'

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })
  const cookies = new Cookies()
  const navigate = useNavigate()

  const toast = useToast()
  const [showOtpComponent, setShowOtpComponent] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)

  const onSubmit = async (values: LoginForm) => {
    setUserEmail(values.email)
    setUserPassword(values.password)
    setIsPending(true)
    await login(values).then(async (data) => {
      if (data.token) {
        cookies.set('token', data.token);
        navigate('/')
      } else {
        setShowOtpComponent(true)
      }
      setIsPending(false)
    }).catch((error) => {
      setIsPending(false)
      toast({
        title: 'Login message!',
        description:
          error.response.data.message || 'Login error',
        status: 'error',
      })
    })
  }

  const iconButtonProps: Omit<IconButtonProps, 'icon' | 'aria-label'> = {
    size: 'lg',
    position: 'absolute',
    top: '2.35rem',
    right: '3',
    minW: 'auto',
    h: 'auto',
    p: '0.5',
    color: 'blackAlpha.800',
    bg: 'transparent !important',
    zIndex: 'docked',
    _hover: { color: 'blackAlpha.600' },
  }

  return (
    <Flex w='full' h='100vh' justify='center' align='center'>
      <Flex w='90vw' maxW='900px' rounded='xl' shadow='md' overflow='hidden'>
        <VStack
          w='50%'
          py='12'
          px='10'
          display={{ base: 'none', md: 'flex' }}
          justify='space-between'
          // bg='#F5F5F5'
          bg='#F0F9FF'
        >
          <Image src={mojaloopLogo} w='60' />

          <Heading as='h1' color='black' textAlign='center'>
            Switch Portal
          </Heading>

          <Box alignSelf='center' color='black' fontSize='sm' fontWeight='medium'>
            <Text>Hotline: +250-788-387-632</Text>
            <Text>Email: info@rswitch.co.rw</Text>
          </Box>
        </VStack>

        {showOtpComponent ?
          <TwoFactorAuth userEmail={userEmail} userPassword={userPassword} setShowOtpComponent={(value: boolean) => setShowOtpComponent(value)} />
          :
          <Stack
            w={{ base: '100%', md: '50%' }}
            py={{ base: '8', sm: '12' }}
            px={{ base: '6', sm: '10' }}
          >
            <Heading fontSize='2xl' mb='6'>
              Log in to your account
            </Heading>

            <Stack
              as='form'
              onSubmit={handleSubmit(onSubmit)}
              w='full'
              data-testid='login-form'
            >
              <FormInput
                name='email'
                register={register}
                errors={errors}
                label='Email'
                placeholder='Enter email'
                maxW='full'
                mb='4'
              />

              <Box position='relative'>
                <FormInput
                  name='password'
                  register={register}
                  errors={errors}
                  label='Password'
                  placeholder='Enter password'
                  inputProps={{ type: isPasswordShown ? 'text' : 'password' }}
                  maxW='full'
                />

                {isPasswordShown ? (
                  <IconButton
                    aria-label='Hide password'
                    icon={<AiFillEyeInvisible />}
                    onClick={() => setIsPasswordShown(false)}
                    {...iconButtonProps}
                  />
                ) : (
                  <IconButton
                    aria-label='Show password'
                    icon={<AiFillEye />}
                    onClick={() => setIsPasswordShown(true)}
                    {...iconButtonProps}
                  />
                )}
              </Box>

              <HStack justify='end'>
                {/* <Checkbox size='sm'>Remember me</Checkbox> */}
                <Link as={NavLink} to='/forgot-password' color='primary' fontSize='sm'>
                  Forgot Password?
                </Link>
              </HStack>

              <CustomButton type='submit' size='md' mt='8' isLoading={isPending}>
                Log In
              </CustomButton>
            </Stack>
          </Stack>
        }
      </Flex>
    </Flex>
  )
}

interface TwoFactorAuthProps {
  userEmail: string,
  userPassword: string,
  setShowOtpComponent: (bool: boolean) => void
}

const TwoFactorAuth = (props: TwoFactorAuthProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorAuthCodeForm>({
    resolver: zodResolver(TwoFactorAuthCodeSchema),
  })

  const toast = useToast()
  const cookies = new Cookies()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState<boolean>(false)

  const onSubmit = async (values: TwoFactorAuthCodeForm) => {
    setIsPending(true)
    await verifyCode(values.verificationCode, props.userEmail)
      .then(async (data) => {
        cookies.set('token', data.token);
        navigate('/')
        setIsPending(false)
        props.setShowOtpComponent(false)
      }).catch((error) => {
        setIsPending(false)
        toast({
          title: 'Login message!',
          description:
            error.response.data.message || 'Login error',
          status: 'error',
        })
      })
  }

  const resendOtp = async () => {
    setIsPending(true)
    const loginObjectToSend: LoginForm = {
      email: props.userEmail,
      password: props.userPassword
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await login(loginObjectToSend).then(async (res: any) => {
      toast({
        title: 'OTP message!',
        description: res?.message || 'OTP Resent successfully',
        status: 'success',
      })
      setIsPending(false)
    }).catch((error) => {
      setIsPending(false)
      toast({
        title: 'Login message!',
        description:
          error.response.data.message || 'Login error',
        status: 'error',
      })
    })
  }

  return (
    <Stack
      w={{ base: '100%', md: '50%' }}
      py={{ base: '8', sm: '12' }}
      px={{ base: '6', sm: '10' }}
    >
      <Heading fontSize='2xl' mb='6'>
        Code Verification
      </Heading>

      <Stack as='form' onSubmit={handleSubmit(onSubmit)} w='full'>
        <Box position='relative'>
          <FormInput
            name='verificationCode'
            register={register}
            errors={errors}
            label='Enter Verification Code'
            placeholder='Enter Verification Code From Your Email'
            maxW='full'
            mb='4'
          />

          <HStack justify='end'>
            {/* <Checkbox size='sm'>Remember me</Checkbox> */}
            <Link as={NavLink} onClick={resendOtp} color='info' fontSize='sm'>
              Resend OTP Code?
            </Link>
          </HStack>
        </Box>

        <CustomButton
          type='submit'
          size='md'
          mt='8'
          isLoading={isPending}
        >
          Verify OTP Code
        </CustomButton>
        <CustomButton
          size='md'
          mt='2'
          variant='outline'
          onClick={() => props.setShowOtpComponent(false)}
          colorVariant='accent-outline'
        >
          Cancel
        </CustomButton>
      </Stack>
    </Stack>
  )
}

export default Login
