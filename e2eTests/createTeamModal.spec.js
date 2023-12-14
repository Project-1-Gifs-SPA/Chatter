import test, { expect } from "@playwright/test";
import { localHost, logInFn } from "./testsHelpFn.js";



// test('should input the team name', async ({ page }) => {
//     await page.goto(localHost);
//     await page.goto(localHost+'welcome');
//     await logInFn(page);
//     await page.getByLabel('navigation bar for teams with').locator('path').click();
//     await page.getByRole('textbox').click();
  
//     const testText = 'Sasho'
//     await page.getByRole('textbox').fill(testText);
  
//     await expect(page.getByRole('textbox')).toHaveValue(testText);
//   });


// test('should show me an error', async({page})=>{

//     await page.goto(localHost);
//     await page.goto(localHost + 'welcome');
//     await logInFn(page);
//     await page.getByLabel('navigation bar for teams with').locator('path').click();
//     await page.getByRole('textbox').click();
  
//     const testText = 'a'
//     await page.getByRole('textbox').fill(testText);
//     await page.getByRole('button', { name: 'Add Team' }).click();

//     await expect(page.getByText('Team name must be')).toBeVisible();

// });


test('should open team modal', async({page})=>{

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page)
    await page.getByLabel('navigation bar for teams with').locator('path').click();
    await page.getByRole('textbox').click();
  
    await expect(page.getByRole('textbox')).toBeVisible();

});


test('should open team',async ({page}) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);
    
    await page.getByLabel('team name Fun Place').click();

    await expect(page.getByRole('heading', { name: 'Fun Place' })).toBeVisible();
    
  });