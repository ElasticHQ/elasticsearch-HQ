'use strict';

export default function (testName, objectType) {
  return `
// Stubbed test.
describe('${testName} ${objectType}', () => {
  it('base test', () => {
    expect(1).toEqual(1);
  });
});
`
}