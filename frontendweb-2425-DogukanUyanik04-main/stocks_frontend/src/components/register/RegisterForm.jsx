import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import zxcvbn from 'zxcvbn'; // Import zxcvbn
import LabelInput from '../LabelInput';
import { useAuth } from '../../contexts/auth';
import Error from '../../components/Error';
import { useThemeColors } from '../../contexts/theme';

export default function Register() {
  const { theme, oppositeTheme } = useThemeColors();
  const { error, loading, register } = useAuth();
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  const methods = useForm();
  const { getValues, handleSubmit, reset } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleRegister = useCallback(
    async ({ naam, email, wachtwoord }) => {
      const loggedIn = await register({
        naam, email, wachtwoord,
      });

      if (loggedIn) {
        navigate({
          pathname: '/',
          replace: true,
        });
      }
    },
    [register, navigate]
  );

  const validationRules = useMemo(() => ({
    naam: { required: 'Name is required' },
    email: { required: 'Email is required' },
    wachtwoord: {
      required: 'Password is required',
      validate: (value) => {
        const result = zxcvbn(value);
        setPasswordStrength(result.score);
        setPasswordFeedback(result.feedback.suggestions.join(' ')); 
        return true;
      }
    },
    confirmPassword: {
      required: 'Password confirmation is required',
      validate: (value) => {
        const wachtwoord = getValues('wachtwoord');
        return wachtwoord === value || 'Passwords do not match';
      },
    },
  }), [getValues]);

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Moderate';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
    setPasswordFeedback(result.feedback.suggestions.join(' '));
  };

  return (
    <FormProvider {...methods}>
      <div className={`container bg-${theme} text-${oppositeTheme}`}>
        <form className="d-flex flex-column" onSubmit={handleSubmit(handleRegister)}>
          <h1>Register</h1>

          <Error error={error} />

          <LabelInput
            label="Naam"
            type="text"
            name="naam"
            placeholder="Your Name"
            validationRules={validationRules.naam}
          />

          <LabelInput
            label="Email"
            type="text"
            name="email"
            placeholder="your@email.com"
            validationRules={validationRules.email}
          />

          <LabelInput
            label="Password"
            type="password"
            name="wachtwoord"
            validationRules={validationRules.wachtwoord}
            onChange={handlePasswordChange} 
          />

          <div>
            <label>Password Strength</label>
            <div
              className="progress"
              style={{
                height: '10px',
                marginBottom: '10px',
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${(passwordStrength / 4) * 100}%`,
                  backgroundColor:
                    passwordStrength === 0
                      ? 'red'
                      : passwordStrength === 1
                      ? 'orange'
                      : passwordStrength === 2
                      ? 'yellow'
                      : 'green',
                }}
              ></div>
            </div>
            <div>{getStrengthLabel()}</div>
            {passwordFeedback && <small>{passwordFeedback}</small>}
          </div>

          <LabelInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            validationRules={validationRules.confirmPassword}
          />

          <div className="clearfix">
            <div className="btn-group float-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                Register
              </button>

              <button
                type="button"
                className="btn btn-light"
                onClick={handleCancel}
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
