const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

router.get('/', async (req, res, next) => {
    try {
        const contacts = await Contact.find().populate('group');
        return res.status(200).json({contacts});
    } catch(error) {
        console.log(error);
        return res.status(500).json({error});
    };
});

router.post('/', async (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("contacts");

    let group = null

    if (req.body.group.length > 0) {
        group = []
        for(const contact of req.body.group ) {
            const contactInDB = await Contact.findOne({id: contact.id});
            group.push(contactInDB._id);
        }
    }
  
    const contact = new Contact({
      id: maxMessageId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group
    });
  
    contact.save()
      .then(createdMessage => {
        res.status(201).json({
          message: 'Contact added successfully',
          contacts: createdMessage
        });
      })
      .catch(error => {
         res.status(500).json({
            contact: 'An error occurred',
            error: error
          });
      });
  });


router.put('/:id', async (req, res, next) => {
    let group = null

    if (req.body.group.length > 0) {
        group = []
        for(const contact of req.body.group ) {
            console.log(req.body.group)
            const contactInDB = await Contact.findOne({id: contact.id});
            console.log(contactInDB);
            group.push(contactInDB._id);
        }
    }
    Contact.findOne({ id: req.params.id })
      .then(contact => {
        console.log(group);
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.imageUrl = req.body.imageUrl;
        contact.group = group;
  
        Contact.updateOne({ id: req.params.id }, contact)
          .then(result => {
            res.status(204).json({
              contact: 'Contact updated successfully'
            })
          })
          .catch(error => {
             res.status(500).json({
             contact: 'An error occurred',
             error: error
           });
          });
      })
      .catch(error => {
        res.status(500).json({
          contact: 'Contact not found.',
          error: { contact: 'Contact not found'}
        });
      });
  });


router.delete("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            contact: "Contact deleted successfully"
          });
        })
        .catch(error => {
           res.status(500).json({
           contact: 'An error occurred',
           error: error
         });
        })
    })
    .catch(error => {
      res.status(500).json({
        contact: 'Contact not found.',
        error: { contact: 'Contact not found'}
      });
    });
});

module.exports = router; 

