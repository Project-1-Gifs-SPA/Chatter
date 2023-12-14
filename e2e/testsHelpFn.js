
export const localHost = 'http://localhost:5173/'


export const logInFn = async(page) =>{

    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('alekspasov@gmail.com');
    await page.getByLabel('Email address').press('Tab');
    await page.getByLabel('Password').fill('aleksandar');
    await page.getByRole('button', { name: 'Sign in' }).click();
}