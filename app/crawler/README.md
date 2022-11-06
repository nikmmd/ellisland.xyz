# Introduction

This component crawls [USCIS online case status system](https://egov.uscis.gov/casestatus/landing.do). Given a receipt number it will pull the most recent case status from the website. The component responds with a structure suitable for further processing by a machine.

```
Input:
{receipt_number:"IOE00000000"}

Output:
      {
        status: 'Case Is Being Actively Reviewed By USCIS',
        body: 'As of November 3, 2022, we are actively reviewing your Form I-485, Application to Register Permanent Residence or Adjust Status, Receipt Number IOE00000000. Our records show nothing is outstanding at this time. We will let you know if we need anything from you. If you move, go to www.uscis.gov/addresschange to give us your new mailing address.',
        date: '2022-11-03',
        form: 'I-485'
      }
```


# Developer guide


- Install Dependencies (yarn/npm)
```
yarn install 
# or npm install

```

- Run tests 

```
yarn test 
# or npm run test
```

- Run build

```
yarn build
# or npm run build
```

