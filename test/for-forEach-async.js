async function log(info) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(`${info}`);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
}

async function funFor() {
  for (let i = 0; i < 3; i++) {
    let res = await log(`funFor is ${i}`);
    console.log(res);
  }
  console.log('funFor is completed');
}

async function funForEach() {
  [1, 2, 3].forEach(async (item) => {
    let res = await log(`funForEach is ${item}`);
    console.log(res);
  });
  console.log('funForEach is completed');
  funFor();
}
funForEach();
