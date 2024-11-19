'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nagendra Babu Burri',
  movements: [450, -400, 3000, -650, -130, 70, 1300, 680],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Nikhil Babu ketini',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Powerstar Pawankalyan',
  movements: [2000, -200, 340, -300, -20, 50, 400, -460, 500],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Rebalstar Prabhas',
  movements: [430, 1000, 700, 50, 90, 400],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMoments = function(movements, sort= false){
  containerMovements.innerHTML = ''
  const moves = sort ? movements.slice().sort((a,b) => a-b) : movements
  moves.forEach(function(mov,i) {
    const type = mov > 0 ? 'deposit': 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">${mov}€</div>  
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function(accnt){
  const income = accnt.movements.filter(mov => mov > 0).reduce((acc,mov)=> acc + mov, 0);
  labelSumIn.textContent = `${income}€`

  const spends = accnt.movements.filter(mov => mov < 0).reduce((acc,mov)=> acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(spends)}€`

  const interest = accnt.movements.filter(mov => mov > 0).map(deposits => deposits * accnt.interestRate/100)
  .filter(int=> int >= 1).reduce((acc,int)=> acc + int, 0);
  labelSumInterest.textContent = `${interest}€`

}

const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov)=> acc+mov,0)
  labelBalance.textContent = `${acc.balance}€`;
}

const updateUI = function(acc){
   // Display Moments
   displayMoments(acc.movements);

   // Display balance
   calcDisplayBalance(acc)

   // Display summary 
   calcDisplaySummary(acc)

}


const createUserName = function(acc){
  acc.forEach(accnt =>
    accnt.username = accnt.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  )
}
createUserName(accounts)
// console.log(accounts)

let currentAcc;
btnLogin.addEventListener('click', function(e){
  e.preventDefault()
  
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value)
  

  if(currentAcc?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent= `Welcome back, ${currentAcc.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    // clear the input vales 
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()

    // To Update UI
    updateUI(currentAcc)

   
  }
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const receiver_acc = accounts.find(acc=> acc.username === inputTransferTo.value)

  inputTransferAmount.value = inputTransferTo.value = ''
  if(amount > 0 && 
    receiver_acc && currentAcc.balance >= amount
    && receiver_acc?.username !== currentAcc.username
  ){
    currentAcc.movements.push(-amount);
    receiver_acc.movements.push(amount)

    // To Update UI
    updateUI(currentAcc)
  }
})

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const loan_amount = Number(inputLoanAmount.value)
  if(loan_amount > 0 && 
    currentAcc.movements.some(mov => mov >=loan_amount * 0.1)
  ){
    currentAcc.movements.push(loan_amount)
    updateUI(currentAcc)
  }
  inputLoanAmount.value = ''

})

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  const del_user_pin = Number(inputClosePin.value)
  const del_user = accounts.find(acc => acc.username === inputCloseUsername.value)
  if(del_user && del_user?.username === currentAcc.username && currentAcc.pin === del_user_pin){
    // delete account
    accounts.splice((accounts.findIndex(acc => acc.username === currentAcc.username)),1)
    // hide UI
    containerApp.style.opacity = 0;

  }
  inputCloseUsername.value = inputClosePin.value = ''

})

let sorted = false
btnSort.addEventListener('click', function(e){
  e.preventDefault()
  displayMoments(currentAcc.movements, !sorted)
  sorted = !sorted
})

// flat method
const overAllBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov,0)
// console.log(overAllBalance)

// flatMap method
const overAllBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov,0)
// console.log(overAllBalance2)

// Sort method
// Ascending
// const mov = account1.movements.sort((a,b) => a < b ? -1 : 1)
const mov = account1.movements.sort((a,b) => a - b)
// console.log(mov)
// Decending
// const mov_desc = account1.movements.sort((a,b) => a > b ? -1 : 1)
const mov_desc = account1.movements.sort((a,b) => b - a)
// console.log(mov_desc)


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). 
For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, 
and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
*/

const checkDogs = function(dogsJulia,dogsKate) {
  let juliacorrectdogs = dogsJulia.slice()
  juliacorrectdogs.splice(0,1)
  juliacorrectdogs.splice(-2)

  const dogs = juliacorrectdogs.concat(dogsKate)

  dogs.forEach(function(dog, i){
    if(dog >= 3){
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`)
    }else{
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  })
}

// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3])
// checkDogs([9, 16, 6, 8, 3],[10, 5, 6, 1, 4])

// Coding Challenge #2
/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate
the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
 humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const calcAverageHumanAge = function(ages){
  const humanage = ages.map(age => age <=2 ? 2*age : 16 + age*4
  )
  const less18dogs = humanage.filter(val => val >=18)
  const avgAge = less18dogs.reduce((acc, val)=> acc+val,0) / less18dogs.length
  return avgAge

}
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])
// console.log(avg1,avg2)

const calcAverageHumanAgearrow = function(ages){
  const humanage = ages.map(age => age <=2 ? 2*age : 16 + age*4)
  .filter(val => val >=18)
  .reduce((acc, val)=> acc+val,0) / less18dogs.length
  return humanage
}
const avga1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
const avga2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])
// console.log(avga1,avga2)



// Array Methods practice

// adding all deposit amounts of all accounts
const alldeposits = accounts
.flatMap(acc => acc.movements)
.filter(mov => mov > 0)
.reduce((sum, curr) => sum + curr, 0)
// console.log(alldeposits)

// adding all withdrawl amounts of all accounts
const allwithdrawls = accounts
.flatMap(acc => acc.movements)
.filter(mov => mov < 0)
.reduce((sum, curr) => sum + curr, 0)

// console.log(-allwithdrawls)

// Count of deposits that atleast 1000
const deposits1000 = accounts
.flatMap(acc => acc.movements)
.filter(acc => acc >=1000)
.reduce((i) => ++i,0)
// console.log(deposits1000)

// creating a obj for sum of deposits and withdrawl

const sums = accounts
.flatMap(acc => acc.movements)
.reduce((acc, curr) => {
curr > 0 ? acc.deposit_sum+= curr : acc.withdrawl_sum+=curr
return acc
}, {deposit_sum: 0, withdrawl_sum:0})
// console.log(sums)

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and
 add it to the object as a new property. Do NOT create a new array, simply loop over the array. 
 Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, 
so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who 
eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" 
and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

// 1
dogs.forEach(dog => dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
console.log(dogs)
// 2
const sarah_dog = dogs.find(name => name.owners.includes('Sarah'))
// console.log(sarah_dog)
console.log(`Sarah dog is eating too ${sarah_dog.curFood > sarah_dog.recommendedFood ? 'much' : 'litte'} food`)

// 3
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood).flatMap(name => name.owners)
console.log(ownersEatTooMuch)

const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendedFood).flatMap(name => name.owners)
console.log(ownersEatTooLittle)

// 4
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`)
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`)

// 5
console.log(dogs.some(dog => dog.curFood===dog.recommendedFood))

// 6

const dogsEatingOkay = dog => dog.curFood > dog.recommendedFood *0.90 && dog.curFood < dog.recommendedFood *1.10
console.log(dogs.some(dogsEatingOkay))

// 7
console.log(dogs.filter(dogsEatingOkay))

// 8
const dogsFoodAce =  dogs.slice().sort((a,b) => a.recommendedFood-b.recommendedFood)
console.log(dogsFoodAce)