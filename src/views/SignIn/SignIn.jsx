import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppContext from '../../context/AppContext';
import { loginUser } from '../../services/auth.service';
import { MIN_PASSWORD_LENGTH } from '../../common/constants';

const SignIn = () => {

  const { user, setContext } = useContext(AppContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    user ? navigate('/') : null;
  }, [user, navigate]);

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const [showAlert, setShowAlert] = useState(false);

  const onLogin = () => {
    if (!form.email) {
      toast.error("Email is required", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (!form.password && form.password.length < MIN_PASSWORD_LENGTH) {
      toast.error("Password is required and must be at least 6 characters long", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    loginUser(form.email, form.password)
      .then((credential) => {
        setContext({
          user: credential.user,
        });
      })
      .catch(() => setShowAlert(true));
  };

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showAlert]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="space-y-8 mx-auto max-w-lg py-12 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-400"
            style={{ fontFamily: 'Rockwell, sans-serif' }}>Sign in to your account</h1>
        </div>
        <div className="rounded-lg bg-gray-700 dark:bg-gray-700 shadow-lg p-8">
          <div className="space-y-4">
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
              <label className='label' htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={updateForm('password')}
                className="w-full border border-gray-500 bg-gray-400 rounded-md p-2"
              />
            </div>
            <div className="space-y-10">
              <button
                className="text-white px-4 py-2 rounded btn bg-purple-600 transition-colors hover:bg-purple-700 border-none"
                onClick={onLogin}
              >
                Sign in
              </button>
              {showAlert && (
                <div className="bg-red-500 text-white p-2 rounded">
                  Invalid email/password!
                </div>
              )}
              <p className="text-gray-200">
                Don't have an account?{' '}
                <Link to="/sign-up"
                  style={{ fontFamily: 'Rockwell, sans-serif' }}
                  className="text-purple-400">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
