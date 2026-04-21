import { test, expect } from '@playwright/test';

test.describe('项目详情页', () => {
  test('Tabs 存在、切换正确，且交付包和验收记录交互正常', async ({ page }) => {
    await page.goto('/expert/projects/proj-001/overview');

    const tabs = ['概览', 'Scope/报价', '变更单', '交付包', '发布证明', '验收记录', '利润账本'];
    for (const tab of tabs) {
      await expect(page.locator('nav').getByText(tab)).toBeVisible();
    }

    await page.locator('nav').getByText('概览').click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001\/overview/);
    await expect(page.getByText('项目基本信息')).toBeVisible();

    await page.locator('nav').getByText('Scope/报价').click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001\/scope/);
    await expect(page.getByText('Scope 版本列表')).toBeVisible();

    await page.locator('nav').getByText('变更单').click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001\/change-orders/);
    await expect(page.getByRole('heading', { name: '变更单' })).toBeVisible();

    await page.locator('nav').getByText('交付包').click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001\/deliveries/);
    await expect(page.getByRole('heading', { name: '交付包' })).toBeVisible();

    await page.getByRole('button', { name: '新建交付包' }).click();
    await expect(page.getByPlaceholder('例如 v1.0.0')).toBeVisible();
    await expect(page.getByPlaceholder('请输入交付包标题')).toBeVisible();

    await page.locator('nav').getByText('发布证明').click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001\/release-proof/);
    await expect(page.getByRole('heading', { name: '发布证明' })).toBeVisible();

    await page.locator('nav').getByText('验收记录').click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001\/acceptance/);
    await expect(page.getByText('验收动作')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible();

    await page.locator('nav').getByText('利润账本').click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001\/profit/);
    await expect(page.getByRole('heading', { name: '利润账本' })).toBeVisible();
  });
});
