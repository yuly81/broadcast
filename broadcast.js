#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const csv = require('csv')
const fs = require('fs')
const async = require('async')

program
  .version('1.0.0')
  .option('-l, --list [list]', 'list of customers in CSV file')
  .parse(process.argv)

const stream = fs.createReadStream(program.list)
  .pipe(csv.parse({ delimiter: ',' }))

const questions = [
  {
    type: 'input',
    name: 'sender.email',
    message: 'Sender\'s email address - '
  },
  {
    type: 'input',
    name: 'sender.name',
    message: 'Sender\'s name - '
  },
  {
    type: 'input',
    name: 'subject',
    message: 'Subject - '
  }
]

const contactList = []

stream
  .on('error', err => {
    return console.log(err.message)
  })
  .on('data', data => {
    const [firstname, lastname, email] = data
    // console.log(firstname, lastname, email)
    contactList.push({
      name: firstname + lastname,
      email: email
    })
  })
  .on('end', () => {
    inquirer
      .prompt(questions)
      .then(answers => {
        console.log(answers)
        async.each(contactList, function (recipient, fn) {
          console.log(recipient)
        });
      })
  })
