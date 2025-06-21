import { Page } from '@playwright/test';
import { 
    stepParam, 
    assertEnabled, 
    assertNotEnabled, 
    assertVisible, 
    clickElement, 
    performNavigationClick,
    compositeLocator,
} from '@test-utils/navigation.po';

export class SignUpCommon {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators

    private readonly nextStepButton = compositeLocator(() => 
        this.page.locator('form button[type="button"].bg-primary'), 'Next button');
    
    private readonly closeButton = compositeLocator(() => 
        this.page.locator('button').filter({ has: this.page.locator('svg') }).first(), 'Close button');
    
    private readonly stepsContainer = compositeLocator(() => 
        this.page.locator('.text-s.flex.flex-row.gap-6'), 'Steps container');
    
    private readonly activeStep = compositeLocator(() => 
        this.page.locator('.text-s.flex-flex-row.gap-6 button.text-primary'), 'Active step');

	private readonly loginLink = compositeLocator(() =>
		this.page.locator('button.justify-start:has(svg)'), 'Login link');

    private readonly stepButton = (stepNumber: number) => 
        compositeLocator(() => 
            this.page.locator(`.text-s.flex.flex-row.gap-6 button`).nth(stepNumber - 1), 
            `Step ${stepNumber} button`);

    // Actions

    public validateCloseButtonVisible = async (softAssert = false) => await assertVisible(this.closeButton, softAssert);

    public validateCloseButtonEnabled = async (softAssert = false) => await assertEnabled(this.closeButton, softAssert);

    public validateStepsVisible = async (softAssert = false) => await assertVisible(this.stepsContainer, softAssert);

    public validateNextButtonEnabled = async (softAssert = false) => await assertEnabled(this.nextStepButton, softAssert);

    public validateNextButtonNotEnabled = async (softAssert = false) => await assertNotEnabled(this.nextStepButton, softAssert);

    public validateNextButtonVisible = async (softAssert = false) => await assertVisible(this.nextStepButton, softAssert);

    public clickNextButton = async () => await clickElement(this.nextStepButton);

    public clickCloseButton = async () => await clickElement(this.closeButton);

	public validateLoginLinkVisible = async (softAssert = false) => await assertVisible(this.loginLink, softAssert);

	public validateLoginLinkEnabled = async (softAssert = false) => await assertEnabled(this.loginLink, softAssert);

    public async validateNavigationBack(expectedURL: string): Promise<void> {
        await performNavigationClick(this.page, this.closeButton.locator(), `Back Button`, expectedURL);
    }

	public async clickLoginLink(expectedURL: string): Promise<void> {
		await performNavigationClick(this.page, this.loginLink.locator(), 'Login link', expectedURL);
	}

	@stepParam((stepNumber: number) => `I validate Step Number: ${stepNumber} common elements`)
	public async validateStepElements(stepNumber: number) {
		await this.validateCloseButtonVisible();
		await this.validateNextButtonVisible();
		await this.validateLoginLinkVisible();
		await this.validateStepsVisible();
		await this.validateCloseButtonEnabled();
		await this.validateNextButtonEnabled();
		await this.validateLoginLinkEnabled();
		//TODO: Validate THIS step is the active one
	}

    @stepParam((stepNumber: number) => `I validate step ${stepNumber} is active`)
    public async validateActiveStep(expectedStep: number) {
        const activeStepElement = this.stepButton(expectedStep);
        await activeStepElement.locator().waitFor();
        await this.page.locator(`.text-s.flex.flex-row.gap-6 button.text-primary`).nth(expectedStep - 1).waitFor();
    }
}