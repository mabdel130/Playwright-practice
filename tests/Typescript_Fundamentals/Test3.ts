const itemPrice = 25;
const quantity3 = 90;
const total = itemPrice * quantity3;
let displayedTotal :number = 75;

const isVisible = false;
const isEnabled :unknown = false;
const isSubmit = isEnabled || isVisible;
const needsAction = !isSubmit && total <= 0;

console.log( {total, isSubmit, needsAction });
