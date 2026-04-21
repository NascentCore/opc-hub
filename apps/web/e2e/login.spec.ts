import { test, expect } from '@playwright/test';

test.describe('登录页', () => {
  test('应展示登录表单并支持输入与提交', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel('邮箱');
    const passwordInput = page.getByLabel('密码');
    const submitButton = page.getByRole('button', { name: '登录' });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await expect(submitButton).toBeEnabled();

    await submitButton.click();
  });
});
