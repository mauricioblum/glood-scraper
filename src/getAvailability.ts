import fetch from 'cross-fetch';

async function runAvailability() {
  if (process.env.NODE_ENV === 'development') {
    const res = await fetch('http://localhost:3333/availability');
    const data = await res.json();
    console.log(data);
  } else {
    const res = await fetch('https://gloodscraper-test.herokuapp.com/availability');
    const data = await res.json();
    console.log(data);
  }
}

runAvailability();