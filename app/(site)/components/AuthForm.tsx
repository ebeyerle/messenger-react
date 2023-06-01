'use client';

import axios from "axios";
import Input from "@/app/components/Inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { useState, useCallback, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {BsGithub,BsGoogle} from 'react-icons/bs';

import {toast} from "react-hot-toast";
import {signIn, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";
import { callbackify } from "util";


type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(session?.status == 'authenticated') {
            router.push('/users')
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if(variant == 'LOGIN'){
            setVariant('REGISTER');
        }else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
        } = useForm<FieldValues>({
            defaultValues: {
                name: '',
                email:'',
                password:''
            }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        
        if(variant == 'REGISTER') {
            axios.post('/api/register', data)
            .then(() => signIn('credentials', data))
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => setIsLoading(false))
        }
        if(variant == 'LOGIN'){
            signIn('credentials', {
                ...data,
                redirect: false
            })
            .then((callback) => {
                if(callback?.error) {
                    toast.error('Invalid credentials');
                }

                if(callback?.ok && !callback?.error) {
                    toast.success('Logged in!');
                    router.push('/users');
                }
            })
            .finally(() => setIsLoading(false))
        }
    }
        
    const socialAction = (action: string) => {
        setIsLoading(true);
        
        signIn(action, { redirect: false })
        .then((callback) => {
            if(callback?.error){
                toast.error('Invalid Credentials');
            }
            
            if(callback?.ok && !callback?.error) {
                toast.success('Logged in!')
            }
        })
        .finally(() => setIsLoading(false));    
    }

    return (
      <div className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      ">
    
        <div className="
        bg-white
        px-4
        py-8
        shadow
        sm:rounded-lg
        sm:px-10
        ">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {variant == 'REGISTER' && (
                <Input 
                    id="name" 
                    label="Name"  
                    register={register}
                    errors={errors}
                    disabled={isLoading}
                />
            )}
            <Input 
                id="email" 
                label="Email address"  
                type="email"
                register={register}
                errors={errors}
                disabled={isLoading}
            />
            <Input 
                id="password" 
                label="Password"  
                type="password"
                register={register}
                errors={errors}
                disabled={isLoading}
            />
            <div>
                <Button
                    disabled={isLoading}
                    fullWidth
                    type="submit"
                >
                    {variant == 'LOGIN' ? 'Sign in' : 'Register'}
                </Button>
            </div>
            </form>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                    <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                    <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
                </div>
            </div>

            <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                <div>
                    {variant == 'LOGIN' ? 'New to Messenger?' : 'Already have an account'}
                </div>
                <div onClick={toggleVariant} className="underline cursor-pointer">
                    {variant == 'LOGIN' ? 'Create an account' : 'Login'}
                </div>
            </div>

        </div>
      </div>
    )
  }
  
export default AuthForm;

{/*https://www.youtube.com/watch?v=PGPGcKBpAk8
@ timestamp 8:40:00

commands used:
npm install -D prisma
npx prisma init
npx prisma db push

npm install next-auth @prisma/client @next-auth/prisma-adapter bcrypt
npm install -D @types/bcrypt

npm install axios

npm install react-hot-toast

npm install next-superjson-plugin

npm install date-fns

npm install next-cloudinary

npm install @headlessui/react

npm install react-select

npm install react-select
npm install react-spinners

https://www.youtube.com/watch?v=RLkBXBOtP0U

npm install pusher pusher-js
npm install lodash
npm install -D @types/lodash

npm install zustand

npm install zustand

https://pusher.com/channels/realtime-api/?hsa_ver=3&utm_medium=Google_ads&utm_medium=ppc&hsa_ad=634249515260&hsa_acc=2203050851&hsa_src=g&hsa_cam=18879258611&hsa_tgt=kwd-966149507899&hsa_kw=api%20for%20app%20development&gclid=CjwKCAjwpayjBhAnEiwA-7enawgMcMdxUMRYwVa8aZL5WOEdcz3gFq99yvL5wMX_sVOgLMKgwqttAxoCKBEQAvD_BwE&hsa_grp=150141057304&utm_term=api%20for%20app%20development&hsa_mt=b&hsa_net=adwords&utm_source=search_paid&utm_source=adwords&utm_campaign=Channels_PA_SS_US&utm_campaign=Channels_SS_US%26CA


https://cloudinary.com/

Portfolio website ideas:
http://findmatthew.com/
https://www.youtube.com/watch?v=3HNyXCPDQ7Q
https://www.youtube.com/watch?v=hYv6BM2fWd8




https://react-icons.github.io/react-icons/icons?name=fi
Feather: import { IconName } from "react-icons/fi";
FiSend, FiImage

*/}