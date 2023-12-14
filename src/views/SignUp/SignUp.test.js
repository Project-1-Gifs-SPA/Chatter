import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from './SignUp';
import { toast } from 'react-toastify';

describe('SignUp Component', () => {
	it('should show an error message if the email is not valid', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const invalidEmail = 'invalidexample.com';
    const emailInput = screen.getByLabelText('Email address');
    fireEvent.change(emailInput, { target: { value: invalidEmail } });

    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.click(signUpButton);

    const errorMessage = screen.queryByTestId('fail');
    expect(errorMessage).toBeInTheDocument();
  });

	it('should show an error message if the password is less than 6 characters', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const invalidPassword = 'abcde';
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: invalidPassword } });

    const signUpButton = screen.getByTestId('signup-button');
    fireEvent.click(signUpButton);

		const errorMessage = screen.queryByTestId('fail');
		expect(errorMessage).toBeInTheDocument();
  });


it('should throw when first name is not between 3 and 35 characters', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
		const invalidFirstNames = ['pi', 'jo', 'validName','verylongfirstnameexceedingthirtyfivecharacters'];

    invalidFirstNames.forEach(firstName => {
      const firstNameInput = screen.getByLabelText('First Name');
      fireEvent.change(firstNameInput, { target: { value: firstName } });

      const signUpButton = screen.getByTestId('signup-button');
      fireEvent.click(signUpButton);
			const errorMessage = screen.queryByTestId('fail');

			if (firstName.length < 3 || firstName.length > 35) {
				expect(errorMessage).toBeInTheDocument();
			}
    });
  });

});


