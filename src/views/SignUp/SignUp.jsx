import { updateProfile } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { MAX_USERNAME_LENGTH, MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, defaultPicURL, isValidPhoneNumber, statuses } from '../../common/constants';
import { auth } from '../../config/firebase-config';
import AppContext from '../../context/AppContext';
import { registerUser } from '../../services/auth.service';
import { setDefaultPic } from '../../services/storage.service';
import { createUserHandle, getUserByHandle } from '../../services/users.service';

const SignUp = () => {

  const { user, setContext } = useContext(AppContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [fail, setFail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    user ? navigate('/') : null;
  }, [user, navigate]);

  const [form, setForm] = useState({
    email: '',
    handle: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
  });

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const onRegister = (event) => {
    event.preventDefault();

    if (!form.email) {
      setFail('Email is required');
      setShowAlert(true);
      return;
    }
    if (!form.handle) {
      setFail('Handle is required');
      setShowAlert(true);
      return;
    }

    if (!form.phoneNumber) {
      setFail('Phone number is required');
      setShowAlert(true);
      return;
    }

    if (!isValidPhoneNumber(form.phoneNumber)) {
      setFail('Phone number must be valid phone number with 10 digits!');
      setShowAlert(true);
      return;
    }

    if (form.handle.length < MIN_USERNAME_LENGTH || form.handle.length > MAX_USERNAME_LENGTH) {
      setFail('Username must be between 5 and 35 characters!');
      setShowAlert(true);
      return;
    }

    if (form.firstName.length < MIN_NAME_LENGTH || form.firstName.length > MAX_USERNAME_LENGTH) {
      setFail('Name must be between 4 and 35 characters!');
      setShowAlert(true);
      return;
    }

    if (form.lastName.length < MIN_NAME_LENGTH || form.lastName.length > MAX_USERNAME_LENGTH) {
      setFail('Last name must be between 4 and 35 characters!');
      setShowAlert(true);
      return;
    }

    if (!form.password && form.password.length < MIN_PASSWORD_LENGTH) {
      setFail('Password is required and must be at least 6 characters long');
      setShowAlert(true);
      return;
    }

    setLoading(true);

    getUserByHandle(form.handle)
      .then(snapshot => {
        if (snapshot.exists()) {
          throw new Error(`Handle @${form.handle} has already been taken!`);
        }

        return registerUser(form.email, form.password);
      })
      .then(credential =>
        createUserHandle(form.handle, credential.user.uid, credential.user.email, form.firstName, form.lastName, form.phoneNumber, statuses.online)
          .then(() => {
            setContext({
              user: { ...credential.user },
            });
          })
      )
      .then(() => {
        return updateProfile(auth.currentUser, { displayName: form.handle });
      })
      .then(() => {
        return setDefaultPic(auth.currentUser, defaultPicURL, setLoading);
      })
      .catch(e => {
        if (e.code === 'auth/email-already-in-use') {
          setFail('Email has already been used!');
        } else if (e.code === 'auth/weak-password') {
          setFail('Password is required and must be at least 6 characters long!')
        } else if (e.code === 'auth/invalid-email') {
          setFail('Email is not valid!')
        } else {
          setFail(`${e.message}`);
        }
        setShowAlert(true);
      });
  };

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [showAlert]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="space-y-8 mx-auto max-w-xl py-12 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-400" style={{ fontFamily: 'Rockwell, sans-serif' }}>Sign up</h1>
        </div>
        <div className="rounded-lg bg-gray-700 dark:bg-gray-700 shadow-lg p-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-gray-200">
              <div>
                <label className='label' htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  maxLength="32"
                  value={form.firstName}
                  onChange={updateForm('firstName')}
                  className="w-full border border-gray-500 bg-gray-400 rounded-md p-2"
                />
              </div>
              <div>
                <label className='label' htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  maxLength="32"
                  value={form.lastName}
                  onChange={updateForm('lastName')}
                  className="w-full border border-gray-500 bg-gray-400 rounded-md p-2"
                />
              </div>
            </div>
            <div className='text-gray-200'>
              <label className='label' htmlFor="handle">Username</label>
              <input
                type="text"
                name="handle"
                id="handle"
                value={form.handle}
                onChange={updateForm('handle')}
                className="w-full border border-gray-500 bg-gray-400 rounded-md p-2"
              />
            </div>
            <div className='text-gray-200'>
              <label className='label' htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={updateForm('email')}
                className="w-full border border-gray-500 bg-gray-400 rounded-md p-2"
              />
            </div>
            <div className='text-gray-200'>
              <label className='label' htmlFor="phoneNumber">Phone number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                maxLength="32"
                value={form.phoneNumber}
                onChange={updateForm('phoneNumber')}
                className="w-full border border-gray-500 bg-gray-400 rounded-md p-2"
              />
            </div>
            <div className="text-gray-200 relative">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={updateForm('password')}
                  className="w-full border border-gray-500 bg-gray-400 rounded-md p-2"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye className="text-gray-500" />
                  ) : (
                    <FaRegEyeSlash className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <button
              className="text-white px-4 py-2 rounded btn bg-purple-600 transition-colors hover:bg-purple-700 border-none"
              onClick={onRegister}
            >
              Sign up
            </button>
            {showAlert && (
              <div className="bg-red-500 text-white p-2 rounded">
                {fail}
              </div>
            )}
            <div className="pt-6 ">
              <p className="text-gray-200">
                Already a user?{' '}
                <Link to="/sign-in" className="text-purple-400"
                  style={{ fontFamily: 'Rockwell, sans-serif' }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
