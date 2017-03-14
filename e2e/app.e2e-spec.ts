import { DronexerClientPage } from './app.po';

describe('dronexer-client App', () => {
  let page: DronexerClientPage;

  beforeEach(() => {
    page = new DronexerClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
