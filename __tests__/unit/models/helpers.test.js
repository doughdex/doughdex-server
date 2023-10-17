const { setOffset } = require('../../../models/helpers');

describe('setOffset', () => {
  it('should correctly calculate the offset when provided valid inputs', () => {
    let page = 1;
    let limit = 5;
    expect(setOffset(page, limit)).toEqual(0);
    page = 2;
    limit = 5;
    expect(setOffset(page, limit)).toEqual(5);
    page = 3;
    limit = 25;
    expect(setOffset(page, limit)).toEqual(50);
  });
});