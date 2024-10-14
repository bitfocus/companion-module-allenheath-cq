export const muteParameters = [
  {label: 'Ip1', msb: '00', lsb: '00', state: false},
  {label: 'Ip2', msb: '00', lsb: '01', state: false},
  {label: 'Ip3', msb: '00', lsb: '02', state: false},
  {label: 'Ip4', msb: '00', lsb: '03', state: false},
  {label: 'Ip5', msb: '00', lsb: '04', state: false},
  {label: 'Ip6', msb: '00', lsb: '05', state: false},
  {label: 'Ip7', msb: '00', lsb: '06', state: false},
  {label: 'Ip8', msb: '00', lsb: '07', state: false},
  {label: 'Ip9', msb: '00', lsb: '08', state: false},
  {label: 'Ip10', msb: '00', lsb: '09', state: false},
  {label: 'Ip11', msb: '00', lsb: '0A', state: false},
  {label: 'Ip12', msb: '00', lsb: '0B', state: false},
  {label: 'Ip13', msb: '00', lsb: '0C', state: false},
  {label: 'Ip14', msb: '00', lsb: '0D', state: false},
  {label: 'Ip15', msb: '00', lsb: '0E', state: false},
  {label: 'Ip16', msb: '00', lsb: '0F', state: false},
  {label: 'St1', msb: '00', lsb: '18', state: false},
  {label: 'St2', msb: '00', lsb: '1A', state: false},
  {label: 'USB', msb: '00', lsb: '1C', state: false},
  {label: 'BT', msb: '00', lsb: '1E', state: false},
  {label: 'FX1', msb: '00', lsb: '51', state: false},
  {label: 'FX2', msb: '00', lsb: '52', state: false},
  {label: 'FX3', msb: '00', lsb: '53', state: false},
  {label: 'FX4', msb: '00', lsb: '54', state: false},
  {label: 'MainLR', msb: '00', lsb: '44', state: false},
  {label: 'Out1', msb: '00', lsb: '45', state: false},
  {label: 'Out2', msb: '00', lsb: '46', state: false},
  {label: 'Out3', msb: '00', lsb: '47', state: false},
  {label: 'Out4', msb: '00', lsb: '48', state: false},
  {label: 'Out5', msb: '00', lsb: '49', state: false},
  {label: 'Out6', msb: '00', lsb: '4A', state: false},
  {label: 'MGRP1', msb: '04', lsb: '00', state: false},
  {label: 'MGRP2', msb: '04', lsb: '01', state: false},
  {label: 'MGRP3', msb: '04', lsb: '02', state: false},
  {label: 'MGRP4', msb: '04', lsb: '03', state: false},
  {label: 'DCA1', msb: '02', lsb: '00', state: false},
  {label: 'DCA2', msb: '02', lsb: '01', state: false},
  {label: 'DCA3', msb: '02', lsb: '02', state: false},
  {label: 'DCA4', msb: '02', lsb: '03', state: false}
];

export const panMatrix = [
  {
    label: 'Ip1',
    toLR: {msb: '50', lsb: '00'},
    toOut12: {msb: '50', lsb: '44'},
    toOut34: {msb: '50', lsb: '46'},
    toOut56: {msb: '50', lsb: '48'}
  },
  {
    label: 'Ip2',
    toLR: {msb: '50', lsb: '01'},
    toOut12: {msb: '50', lsb: '50'},
    toOut34: {msb: '50', lsb: '52'},
    toOut56: {msb: '50', lsb: '54'}
  },
  {
    label: 'Ip3',
    toLR: {msb: '50', lsb: '02'},
    toOut12: {msb: '50', lsb: '5C'},
    toOut34: {msb: '50', lsb: '5E'},
    toOut56: {msb: '50', lsb: '60'}
  },
  {
    label: 'Ip4',
    toLR: {msb: '50', lsb: '03'},
    toOut12: {msb: '50', lsb: '68'},
    toOut34: {msb: '50', lsb: '6A'},
    toOut56: {msb: '50', lsb: '6C'}
  },
  {
    label: 'Ip5',
    toLR: {msb: '50', lsb: '04'},
    toOut12: {msb: '50', lsb: '74'},
    toOut34: {msb: '50', lsb: '76'},
    toOut56: {msb: '50', lsb: '78'}
  },
  {
    label: 'Ip6',
    toLR: {msb: '50', lsb: '05'},
    toOut12: {msb: '51', lsb: '00'},
    toOut34: {msb: '51', lsb: '02'},
    toOut56: {msb: '51', lsb: '04'}
  },
  {
    label: 'Ip7',
    toLR: {msb: '50', lsb: '06'},
    toOut12: {msb: '51', lsb: '0C'},
    toOut34: {msb: '51', lsb: '0E'},
    toOut56: {msb: '51', lsb: '10'}
  },
  {
    label: 'Ip8',
    toLR: {msb: '50', lsb: '07'},
    toOut12: {msb: '51', lsb: '18'},
    toOut34: {msb: '51', lsb: '1A'},
    toOut56: {msb: '51', lsb: '1C'}
  },
  {
    label: 'Ip9',
    toLR: {msb: '50', lsb: '08'},
    toOut12: {msb: '51', lsb: '24'},
    toOut34: {msb: '51', lsb: '26'},
    toOut56: {msb: '51', lsb: '28'}
  },
  {
    label: 'Ip10',
    toLR: {msb: '50', lsb: '09'},
    toOut12: {msb: '51', lsb: '30'},
    toOut34: {msb: '51', lsb: '32'},
    toOut56: {msb: '51', lsb: '34'}
  },
  {
    label: 'Ip11',
    toLR: {msb: '50', lsb: '0A'},
    toOut12: {msb: '51', lsb: '3C'},
    toOut34: {msb: '51', lsb: '3E'},
    toOut56: {msb: '51', lsb: '40'}
  },
  {
    label: 'Ip12',
    toLR: {msb: '50', lsb: '0B'},
    toOut12: {msb: '51', lsb: '48'},
    toOut34: {msb: '51', lsb: '4A'},
    toOut56: {msb: '51', lsb: '4C'}
  },
  {
    label: 'Ip13',
    toLR: {msb: '50', lsb: '0C'},
    toOut12: {msb: '51', lsb: '54'},
    toOut34: {msb: '51', lsb: '56'},
    toOut56: {msb: '51', lsb: '58'}
  },
  {
    label: 'Ip14',
    toLR: {msb: '50', lsb: '0D'},
    toOut12: {msb: '51', lsb: '60'},
    toOut34: {msb: '51', lsb: '62'},
    toOut56: {msb: '51', lsb: '64'}
  },
  {
    label: 'Ip15',
    toLR: {msb: '50', lsb: '0E'},
    toOut12: {msb: '51', lsb: '6C'},
    toOut34: {msb: '51', lsb: '6E'},
    toOut56: {msb: '51', lsb: '70'}
  },
  {
    label: 'Ip16',
    toLR: {msb: '50', lsb: '0F'},
    toOut12: {msb: '51', lsb: '78'},
    toOut34: {msb: '51', lsb: '7A'},
    toOut56: {msb: '51', lsb: '7C'}
  },
  {
    label: 'ST1',
    toLR: {msb: '50', lsb: '18'},
    toOut12: {msb: '52', lsb: '64'},
    toOut34: {msb: '52', lsb: '66'},
    toOut56: {msb: '52', lsb: '68'}
  },
  {
    label: 'ST2',
    toLR: {msb: '50', lsb: '1A'},
    toOut12: {msb: '52', lsb: '7C'},
    toOut34: {msb: '52', lsb: '7E'},
    toOut56: {msb: '53', lsb: '0'}
  },
  {
    label: 'USB',
    toLR: {msb: '50', lsb: '1C'},
    toOut12: {msb: '53', lsb: '14'},
    toOut34: {msb: '53', lsb: '16'},
    toOut56: {msb: '53', lsb: '18'}
  },
  {
    label: 'BT',
    toLR: {msb: '50', lsb: '1E'},
    toOut12: {msb: '53', lsb: '2C'},
    toOut34: {msb: '53', lsb: '2E'},
    toOut56: {msb: '53', lsb: '30'}
  },
  {
    label: 'FX1',
    toLR: {msb: '50', lsb: '3C'},
    toOut12: {msb: '56', lsb: '14'},
    toOut34: {msb: '56', lsb: '16'},
    toOut56: {msb: '56', lsb: '18'}
  },
  {
    label: 'FX2',
    toLR: {msb: '50', lsb: '3D'},
    toOut12: {msb: '56', lsb: '20'},
    toOut34: {msb: '56', lsb: '22'},
    toOut56: {msb: '56', lsb: '24'}
  },
  {
    label: 'FX3',
    toLR: {msb: '50', lsb: '3E'},
    toOut12: {msb: '56', lsb: '2C'},
    toOut34: {msb: '56', lsb: '2E'},
    toOut56: {msb: '56', lsb: '30'}
  },
  {
    label: 'FX4',
    toLR: {msb: '50', lsb: '3F'},
    toOut12: {msb: '56', lsb: '38'},
    toOut34: {msb: '56', lsb: '3A'},
    toOut56: {msb: '56', lsb: '3C'}
  },
];

export const levelMatrixInputs = [
  {
    label: 'Ip1',
    toLR: {msb: '40', lsb: '00'},
    toOut1: {msb: '40', lsb: '44'},
    toOut2: {msb: '40', lsb: '45'},
    toOut3: {msb: '40', lsb: '46'},
    toOut4: {msb: '40', lsb: '47'},
    toOut5: {msb: '40', lsb: '48'},
    toOut6: {msb: '40', lsb: '49'},
    toFX1: {msb: '4C', lsb: '14'},
    toFX2: {msb: '4C', lsb: '15'},
    toFX3: {msb: '4C', lsb: '16'},
    toFX4: {msb: '4C', lsb: '17'}
  },
  {
    label: 'Ip2',
    toLR: {msb: '40', lsb: '01'},
    toOut1: {msb: '40', lsb: '50'},
    toOut2: {msb: '40', lsb: '51'},
    toOut3: {msb: '40', lsb: '52'},
    toOut4: {msb: '40', lsb: '53'},
    toOut5: {msb: '40', lsb: '54'},
    toOut6: {msb: '40', lsb: '55'},
    toFX1: {msb: '4C', lsb: '18'},
    toFX2: {msb: '4C', lsb: '19'},
    toFX3: {msb: '4C', lsb: '1A'},
    toFX4: {msb: '4C', lsb: '1B'}
  },
  {
    label: 'Ip3',
    toLR: {msb: '40', lsb: '02'},
    toOut1: {msb: '40', lsb: '5C'},
    toOut2: {msb: '40', lsb: '5D'},
    toOut3: {msb: '40', lsb: '5E'},
    toOut4: {msb: '40', lsb: '5F'},
    toOut5: {msb: '40', lsb: '60'},
    toOut6: {msb: '40', lsb: '61'},
    toFX1: {msb: '4C', lsb: '1C'},
    toFX2: {msb: '4C', lsb: '1D'},
    toFX3: {msb: '4C', lsb: '1E'},
    toFX4: {msb: '4C', lsb: '1F'}
  },
  {
    label: 'Ip4',
    toLR: {msb: '40', lsb: '03'},
    toOut1: {msb: '40', lsb: '68'},
    toOut2: {msb: '40', lsb: '69'},
    toOut3: {msb: '40', lsb: '6A'},
    toOut4: {msb: '40', lsb: '6B'},
    toOut5: {msb: '40', lsb: '6C'},
    toOut6: {msb: '40', lsb: '6D'},
    toFX1: {msb: '4C', lsb: '20'},
    toFX2: {msb: '4C', lsb: '21'},
    toFX3: {msb: '4C', lsb: '22'},
    toFX4: {msb: '4C', lsb: '23'}
  },
  {
    label: 'Ip5',
    toLR: {msb: '40', lsb: '04'},
    toOut1: {msb: '40', lsb: '74'},
    toOut2: {msb: '40', lsb: '75'},
    toOut3: {msb: '40', lsb: '76'},
    toOut4: {msb: '40', lsb: '77'},
    toOut5: {msb: '40', lsb: '78'},
    toOut6: {msb: '40', lsb: '79'},
    toFX1: {msb: '4C', lsb: '24'},
    toFX2: {msb: '4C', lsb: '25'},
    toFX3: {msb: '4C', lsb: '26'},
    toFX4: {msb: '4C', lsb: '27'}
  },
  {
    label: 'Ip6',
    toLR: {msb: '40', lsb: '05'},
    toOut1: {msb: '41', lsb: '00'},
    toOut2: {msb: '41', lsb: '01'},
    toOut3: {msb: '41', lsb: '02'},
    toOut4: {msb: '41', lsb: '03'},
    toOut5: {msb: '41', lsb: '04'},
    toOut6: {msb: '41', lsb: '05'},
    toFX1: {msb: '4C', lsb: '28'},
    toFX2: {msb: '4C', lsb: '29'},
    toFX3: {msb: '4C', lsb: '2A'},
    toFX4: {msb: '4C', lsb: '2B'}
  },
  {
    label: 'Ip7',
    toLR: {msb: '40', lsb: '06'},
    toOut1: {msb: '41', lsb: '0C'},
    toOut2: {msb: '41', lsb: '0D'},
    toOut3: {msb: '41', lsb: '0E'},
    toOut4: {msb: '41', lsb: '0F'},
    toOut5: {msb: '41', lsb: '10'},
    toOut6: {msb: '41', lsb: '11'},
    toFX1: {msb: '4C', lsb: '2C'},
    toFX2: {msb: '4C', lsb: '2D'},
    toFX3: {msb: '4C', lsb: '2E'},
    toFX4: {msb: '4C', lsb: '2F'}
  },
  {
    label: 'Ip8',
    toLR: {msb: '40', lsb: '07'},
    toOut1: {msb: '41', lsb: '18'},
    toOut2: {msb: '41', lsb: '19'},
    toOut3: {msb: '41', lsb: '1A'},
    toOut4: {msb: '41', lsb: '1B'},
    toOut5: {msb: '41', lsb: '1C'},
    toOut6: {msb: '41', lsb: '1D'},
    toFX1: {msb: '4C', lsb: '30'},
    toFX2: {msb: '4C', lsb: '31'},
    toFX3: {msb: '4C', lsb: '32'},
    toFX4: {msb: '4C', lsb: '33'}
  },
  {
    label: 'Ip9',
    toLR: {msb: '40', lsb: '08'},
    toOut1: {msb: '41', lsb: '24'},
    toOut2: {msb: '41', lsb: '25'},
    toOut3: {msb: '41', lsb: '26'},
    toOut4: {msb: '41', lsb: '27'},
    toOut5: {msb: '41', lsb: '28'},
    toOut6: {msb: '41', lsb: '29'},
    toFX1: {msb: '4C', lsb: '34'},
    toFX2: {msb: '4C', lsb: '35'},
    toFX3: {msb: '4C', lsb: '36'},
    toFX4: {msb: '4C', lsb: '37'}
  },
  {
    label: 'Ip10',
    toLR: {msb: '40', lsb: '09'},
    toOut1: {msb: '41', lsb: '30'},
    toOut2: {msb: '41', lsb: '31'},
    toOut3: {msb: '41', lsb: '32'},
    toOut4: {msb: '41', lsb: '33'},
    toOut5: {msb: '41', lsb: '34'},
    toOut6: {msb: '41', lsb: '35'},
    toFX1: {msb: '4C', lsb: '38'},
    toFX2: {msb: '4C', lsb: '39'},
    toFX3: {msb: '4C', lsb: '3A'},
    toFX4: {msb: '4C', lsb: '3B'}
  },
  {
    label: 'Ip11',
    toLR: {msb: '40', lsb: '0A'},
    toOut1: {msb: '41', lsb: '3C'},
    toOut2: {msb: '41', lsb: '3D'},
    toOut3: {msb: '41', lsb: '3E'},
    toOut4: {msb: '41', lsb: '3F'},
    toOut5: {msb: '41', lsb: '40'},
    toOut6: {msb: '41', lsb: '41'},
    toFX1: {msb: '4C', lsb: '3C'},
    toFX2: {msb: '4C', lsb: '3D'},
    toFX3: {msb: '4C', lsb: '3E'},
    toFX4: {msb: '4C', lsb: '3F'}
  },
  {
    label: 'Ip12',
    toLR: {msb: '40', lsb: '0B'},
    toOut1: {msb: '41', lsb: '48'},
    toOut2: {msb: '41', lsb: '49'},
    toOut3: {msb: '41', lsb: '4A'},
    toOut4: {msb: '41', lsb: '4B'},
    toOut5: {msb: '41', lsb: '4C'},
    toOut6: {msb: '41', lsb: '4D'},
    toFX1: {msb: '4C', lsb: '40'},
    toFX2: {msb: '4C', lsb: '41'},
    toFX3: {msb: '4C', lsb: '42'},
    toFX4: {msb: '4C', lsb: '43'}
  },
  {
    label: 'Ip13',
    toLR: {msb: '40', lsb: '0C'},
    toOut1: {msb: '41', lsb: '54'},
    toOut2: {msb: '41', lsb: '55'},
    toOut3: {msb: '41', lsb: '56'},
    toOut4: {msb: '41', lsb: '57'},
    toOut5: {msb: '41', lsb: '58'},
    toOut6: {msb: '41', lsb: '59'},
    toFX1: {msb: '4C', lsb: '44'},
    toFX2: {msb: '4C', lsb: '45'},
    toFX3: {msb: '4C', lsb: '46'},
    toFX4: {msb: '4C', lsb: '47'}
  },
  {
    label: 'Ip14',
    toLR: {msb: '40', lsb: '0D'},
    toOut1: {msb: '41', lsb: '60'},
    toOut2: {msb: '41', lsb: '61'},
    toOut3: {msb: '41', lsb: '62'},
    toOut4: {msb: '41', lsb: '63'},
    toOut5: {msb: '41', lsb: '64'},
    toOut6: {msb: '41', lsb: '65'},
    toFX1: {msb: '4C', lsb: '48'},
    toFX2: {msb: '4C', lsb: '49'},
    toFX3: {msb: '4C', lsb: '4A'},
    toFX4: {msb: '4C', lsb: '4B'}
  },
  {
    label: 'Ip15',
    toLR: {msb: '40', lsb: '0E'},
    toOut1: {msb: '41', lsb: '6C'},
    toOut2: {msb: '41', lsb: '6D'},
    toOut3: {msb: '41', lsb: '6E'},
    toOut4: {msb: '41', lsb: '6F'},
    toOut5: {msb: '41', lsb: '70'},
    toOut6: {msb: '41', lsb: '71'},
    toFX1: {msb: '4C', lsb: '4C'},
    toFX2: {msb: '4C', lsb: '4D'},
    toFX3: {msb: '4C', lsb: '4E'},
    toFX4: {msb: '4C', lsb: '4F'}
  },
  {
    label: 'Ip16',
    toLR: {msb: '40', lsb: '0F'},
    toOut1: {msb: '41', lsb: '78'},
    toOut2: {msb: '41', lsb: '79'},
    toOut3: {msb: '41', lsb: '7A'},
    toOut4: {msb: '41', lsb: '7B'},
    toOut5: {msb: '41', lsb: '7C'},
    toOut6: {msb: '41', lsb: '7D'},
    toFX1: {msb: '4C', lsb: '50'},
    toFX2: {msb: '4C', lsb: '51'},
    toFX3: {msb: '4C', lsb: '52'},
    toFX4: {msb: '4C', lsb: '53'}
  },
  {
    label: 'ST1',
    toLR: {msb: '40', lsb: '18'},
    toOut1: {msb: '42', lsb: '64'},
    toOut2: {msb: '42', lsb: '65'},
    toOut3: {msb: '42', lsb: '66'},
    toOut4: {msb: '42', lsb: '67'},
    toOut5: {msb: '42', lsb: '68'},
    toOut6: {msb: '42', lsb: '69'},
    toFX1: {msb: '4C', lsb: '74'},
    toFX2: {msb: '4C', lsb: '75'},
    toFX3: {msb: '4C', lsb: '76'},
    toFX4: {msb: '4C', lsb: '77'}
  },
  {
    label: 'ST2',
    toLR: {msb: '40', lsb: '1A'},
    toOut1: {msb: '42', lsb: '7C'},
    toOut2: {msb: '42', lsb: '7D'},
    toOut3: {msb: '42', lsb: '7E'},
    toOut4: {msb: '42', lsb: '7F'},
    toOut5: {msb: '43', lsb: '00'},
    toOut6: {msb: '43', lsb: '01'},
    toFX1: {msb: '4C', lsb: '7C'},
    toFX2: {msb: '4C', lsb: '7D'},
    toFX3: {msb: '4C', lsb: '7E'},
    toFX4: {msb: '4C', lsb: '7F'}
  },
  {
    label: 'USB',
    toLR: {msb: '40', lsb: '1C'},
    toOut1: {msb: '43', lsb: '14'},
    toOut2: {msb: '43', lsb: '15'},
    toOut3: {msb: '43', lsb: '16'},
    toOut4: {msb: '43', lsb: '17'},
    toOut5: {msb: '43', lsb: '18'},
    toOut6: {msb: '43', lsb: '19'},
    toFX1: {msb: '4D', lsb: '04'},
    toFX2: {msb: '4D', lsb: '05'},
    toFX3: {msb: '4D', lsb: '06'},
    toFX4: {msb: '4D', lsb: '07'}
  },
  {
    label: 'BT',
    toLR: {msb: '40', lsb: '1E'},
    toOut1: {msb: '43', lsb: '2C'},
    toOut2: {msb: '43', lsb: '2D'},
    toOut3: {msb: '43', lsb: '2E'},
    toOut4: {msb: '43', lsb: '2F'},
    toOut5: {msb: '43', lsb: '30'},
    toOut6: {msb: '43', lsb: '31'},
    toFX1: {msb: '4D', lsb: '0C'},
    toFX2: {msb: '4D', lsb: '0D'},
    toFX3: {msb: '4D', lsb: '0E'},
    toFX4: {msb: '4D', lsb: '0F'}
  },
  {
    label: 'FX1',
    toLR: {msb: '40', lsb: '3C'},
    toOut1: {msb: '46', lsb: '14'},
    toOut2: {msb: '46', lsb: '15'},
    toOut3: {msb: '46', lsb: '16'},
    toOut4: {msb: '46', lsb: '17'},
    toOut5: {msb: '46', lsb: '18'},
    toOut6: {msb: '46', lsb: '19'},
    toFX1: {msb: '00', lsb: '00'},
    toFX2: {msb: '4E', lsb: '05'},
    toFX3: {msb: '4E', lsb: '06'},
    toFX4: {msb: '4E', lsb: '07'}
  },
  {
    label: 'FX2',
    toLR: {msb: '40', lsb: '3D'},
    toOut1: {msb: '46', lsb: '20'},
    toOut2: {msb: '46', lsb: '21'},
    toOut3: {msb: '46', lsb: '22'},
    toOut4: {msb: '46', lsb: '23'},
    toOut5: {msb: '46', lsb: '24'},
    toOut6: {msb: '46', lsb: '25'},
    toFX1: {msb: '4E', lsb: '08'},
    toFX2: {msb: '00', lsb: '00'},
    toFX3: {msb: '4E', lsb: '0A'},
    toFX4: {msb: '4E', lsb: '0B'}
  },
  {
    label: 'FX3',
    toLR: {msb: '40', lsb: '3E'},
    toOut1: {msb: '46', lsb: '2C'},
    toOut2: {msb: '46', lsb: '2D'},
    toOut3: {msb: '46', lsb: '2E'},
    toOut4: {msb: '46', lsb: '2F'},
    toOut5: {msb: '46', lsb: '30'},
    toOut6: {msb: '46', lsb: '31'},
    toFX1: {msb: '4E', lsb: '0C'},
    toFX2: {msb: '4E', lsb: '0D'},
    toFX3: {msb: '00', lsb: '00'},
    toFX4: {msb: '4E', lsb: '0F'}
  },
  {
    label: 'FX4',
    toLR: {msb: '40', lsb: '3F'},
    toOut1: {msb: '46', lsb: '38'},
    toOut2: {msb: '46', lsb: '39'},
    toOut3: {msb: '46', lsb: '3A'},
    toOut4: {msb: '46', lsb: '3B'},
    toOut5: {msb: '46', lsb: '3C'},
    toOut6: {msb: '46', lsb: '3D'},
    toFX1: {msb: '4E', lsb: '10'},
    toFX2: {msb: '4E', lsb: '11'},
    toFX3: {msb: '4E', lsb: '12'},
    toFX4: {msb: '00', lsb: '00'}
  }
];

export const levelMatrixOutputs =
    [
      {label: 'MainLR', msb: '4F', lsb: '00'},
      {label: 'Out1', msb: '4F', lsb: '01'},
      {label: 'Out2', msb: '4F', lsb: '02'},
      {label: 'Out3', msb: '4F', lsb: '03'},
      {label: 'Out4', msb: '4F', lsb: '04'},
      {label: 'Out5', msb: '4F', lsb: '05'},
      {label: 'Out6', msb: '4F', lsb: '06'},
      {label: 'FX1', msb: '4F', lsb: '0D'},
      {label: 'FX2', msb: '4F', lsb: '0E'},
      {label: 'FX3', msb: '4F', lsb: '0F'},
      {label: 'FX4', msb: '4F', lsb: '10'},
      {label: 'DCA1', msb: '4F', lsb: '20'},
      {label: 'DCA2', msb: '4F', lsb: '21'},
      {label: 'DCA3', msb: '4F', lsb: '22'},
      {label: 'DCA4', msb: '4F', lsb: '23'},
    ]

    export const dbValues = [
      {label: '-inf', VC: '00', VF: '00'}, {label: '-89', VC: '01', VF: '40'},
      {label: '-85', VC: '02', VF: '00'},  {label: '-80', VC: '02', VF: '40'},
      {label: '-75', VC: '03', VF: '40'},  {label: '-70', VC: '04', VF: '00'},
      {label: '-65', VC: '05', VF: '00'},  {label: '-60', VC: '06', VF: '00'},
      {label: '-55', VC: '07', VF: '00'},  {label: '-50', VC: '08', VF: '00'},
      {label: '-45', VC: '0C', VF: '00'},  {label: '-40', VC: '0F', VF: '40'},
      {label: '-38', VC: '12', VF: '40'},  {label: '-36', VC: '15', VF: '40'},
      {label: '-35', VC: '17', VF: '00'},  {label: '-34', VC: '19', VF: '00'},
      {label: '-33', VC: '1A', VF: '40'},  {label: '-32', VC: '1C', VF: '00'},
      {label: '-31', VC: '1D', VF: '40'},  {label: '-30', VC: '1F', VF: '00'},
      {label: '-29', VC: '20', VF: '40'},  {label: '-28', VC: '22', VF: '00'},
      {label: '-27', VC: '23', VF: '40'},  {label: '-26', VC: '25', VF: '00'},
      {label: '-25', VC: '26', VF: '40'},  {label: '-24', VC: '28', VF: '40'},
      {label: '-23', VC: '2A', VF: '00'},  {label: '-22', VC: '2B', VF: '40'},
      {label: '-21', VC: '2D', VF: '00'},  {label: '-20', VC: '2E', VF: '40'},
      {label: '-19', VC: '30', VF: '00'},  {label: '-18', VC: '31', VF: '40'},
      {label: '-17', VC: '33', VF: '00'},  {label: '-16', VC: '34', VF: '40'},
      {label: '-15', VC: '36', VF: '00'},  {label: '-14', VC: '38', VF: '00'},
      {label: '-13', VC: '39', VF: '40'},  {label: '-12', VC: '3B', VF: '00'},
      {label: '-11', VC: '3C', VF: '40'},  {label: '-10', VC: '3E', VF: '00'},
      {label: '-9', VC: '41', VF: '40'},   {label: '-8', VC: '44', VF: '40'},
      {label: '-7', VC: '48', VF: '00'},   {label: '-6', VC: '4B', VF: '00'},
      {label: '-5', VC: '4E', VF: '40'},   {label: '-4', VC: '52', VF: '40'},
      {label: '-3', VC: '56', VF: '40'},   {label: '-2', VC: '5A', VF: '00'},
      {label: '-1', VC: '5E', VF: '00'},   {label: '0', VC: '62', VF: '00'},
      {label: '+1', VC: '65', VF: '40'},   {label: '+2', VC: '69', VF: '00'},
      {label: '+3', VC: '6C', VF: '40'},   {label: '+4', VC: '70', VF: '00'},
      {label: '+5', VC: '73', VF: '40'},   {label: '+6', VC: '75', VF: '40'},
      {label: '+7', VC: '78', VF: '00'},   {label: '+8', VC: '7A', VF: '40'},
      {label: '+9', VC: '7D', VF: '00'},   {label: '+10', VC: '7F', VF: '40'}
    ];

export const panValues = [
  {label: 'L100%', VC: '00', VF: '00'}, {label: 'L90%', VC: '06', VF: '33'},
  {label: 'L80%', VC: '0C', VF: '66'},  {label: 'L70%', VC: '13', VF: '19'},
  {label: 'L60%', VC: '19', VF: '4C'},  {label: 'L50%', VC: '1F', VF: '7F'},
  {label: 'L40%', VC: '26', VF: '32'},  {label: 'L30%', VC: '2C', VF: '65'},
  {label: 'L20%', VC: '33', VF: '18'},  {label: 'L15%', VC: '36', VF: '32'},
  {label: 'L10%', VC: '39', VF: '4B'},  {label: 'L5%', VC: '3C', VF: '65'},
  {label: 'CTR', VC: '40', VF: '00'},   {label: 'R5%', VC: '43', VF: '18'},
  {label: 'R10%', VC: '46', VF: '32'},  {label: 'R15%', VC: '49', VF: '4B'},
  {label: 'R20%', VC: '4C', VF: '65'},  {label: 'R30%', VC: '53', VF: '18'},
  {label: 'R40%', VC: '59', VF: '4B'},  {label: 'R50%', VC: '5F', VF: '7F'},
  {label: 'R60%', VC: '66', VF: '32'},  {label: 'R70%', VC: '6C', VF: '65'},
  {label: 'R80%', VC: '73', VF: '18'},  {label: 'R90%', VC: '79', VF: '4B'},
  {label: 'R100%', VC: '7F', VF: '7F'}
];

export function hexToByteArray(hex) {
  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    // Use slice() instead of substr()
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }

  return bytes;
};

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
