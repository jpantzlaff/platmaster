export const distanceUnits = [
  {
    label: 'Chain (India)',
    value: {
      abbr: 'ind-ch',
      factor: 20.11669506
    }
  },
  {
    label: 'Chain (US)',
    value: {
      abbr: 'us-ch',
      factor: 20.11684023368047
    }
  },
  {
    label: 'Foot',
    value: {
      abbr: 'ft',
      factor: 0.3048
    }
  },
  {
    label: 'Foot (India)',
    value: {
      abbr: 'ind-ft',
      factor: 0.30479841
    }
  },
  {
    label: 'Foot (US)',
    value: {
      abbr: 'us-ft',
      factor: 0.304800609601219
    }
  },
  {
    label: 'Inch',
    value: {
      abbr: 'in',
      factor: 0.0254
    }
  },
  {
    label: 'Meter',
    value: {
      abbr: 'm',
      factor: 1
    }
  },
  {
    label: 'Yard',
    value: {
      abbr: 'yd',
      factor: 0.9144
    }
  },
  {
    label: 'Yard (India)',
    value: {
      abbr: 'ind-yd',
      factor: 0.91439523
    }
  },
  {
    label: 'Yard (US)',
    value: {
      abbr: 'us-yd',
      factor: 0.914401828803658
    }
  }
];

const magDeclinationYears = [];
for (let year = 1590, max = Math.min(new Date().getFullYear(), 2024); year < max; year++) {
  magDeclinationYears.push(year);
}
export {magDeclinationYears};