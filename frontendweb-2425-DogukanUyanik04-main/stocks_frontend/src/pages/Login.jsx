import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';

const validationRules = {
  email: {
    required: 'Email is required',
  },
  wachtwoord: {
    required: 'Password is required',
  },
};

export default function Login() {
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  const methods = useForm({
    defaultValues: {
      email: '', 
      wachtwoord: '',
    },
  });
  const { handleSubmit, reset } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleLogin = useCallback(
    async ({ email, wachtwoord }) => {
      console.log('Login payload:', { email, wachtwoord });

      const loggedIn = await login(email, wachtwoord);

      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get('redirect') || '/',
          replace: true,
        });
      }
    },
    [login, navigate, search],
  );


  
  return (
    <FormProvider {...methods}>
      <div className='container'>
        <form
          className='d-flex flex-column'
          onSubmit={handleSubmit(handleLogin)}
        >
          <h1>Sign in</h1>
          <Error error={error} />
          <LabelInput
            label='email'
            type='text'
            name='email'
            placeholder='your@email.com'
            validationRules={validationRules.email}
            data-cy='email_input'
          />
          <LabelInput
            label='wachtwoord'
            type='password'
            name='wachtwoord'  
            validationRules={validationRules.wachtwoord}  
            data-cy='password_input'
          />
          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={loading}
                data-cy='submit_btn'
              >
                Sign in
              </button>

              <button
                type='button'
                className='btn btn-light'
                onClick={handleCancel}
                data-cy='cancel_btn'
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
