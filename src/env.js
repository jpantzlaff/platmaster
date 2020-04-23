export const distanceUnits = [
  {label: 'Chain (India)', value: 'ind-ch'},
  {label: 'Chain (US)', value: 'us-ch'},
  {label: 'Foot', value: 'ft'},
  {label: 'Foot (India)', value: 'ind-ft'},
  {label: 'Foot (US)', value: 'us-ft'},
  {label: 'Inch', value: 'in'},
  {label: 'Meter', value: 'm'},
  {label: 'Yard', value: 'yd'},
  {label: 'Yard (India)', value: 'ind-yd'},
  {label: 'Yard (US)', value: 'us-yd'}
];

const magDeclinationYears = [];
for (let year = 1590, max = 2024; year < max; year++) {
  magDeclinationYears.push(year);
}
export {magDeclinationYears};