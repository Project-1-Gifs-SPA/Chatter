import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignIn from './SignIn';
import * as authService from '../../services/auth.service';

describe('SignIn Component', () => {
	it('should contain email', () => {
		render(
			<Router>
		<SignIn />
		</Router>);
		const email = screen.getByText(/Email address/i);
		expect(email).toBeInTheDocument();
	})
});