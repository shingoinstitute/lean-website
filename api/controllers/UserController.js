module.exports = {
   users: function(req, res) {
      User.find().exec(function(err, users) {
         if (err) {
            return res.json({
               success: false,
               error: err
            })
         } else {
            return res.json({
               success: true,
               users: users
            })
         }
      })
   },

   createUser: function(req, res) {
      var user = {
         name: 'Craig',
         age: 27,
         gender: 'male'
      }

      User.findOne({name: 'Craig'}).exec(function(err, user) {
         if (err) return res.json({error: err})
         if (!user) {
            User.create(user).exec(function(err, user) {
               if (err) return res.json({error: err})
               return res.json({
                  success: true,
                  user: user
               })
            })
         } else {
            return res.json({
               error: 'User already exists'
            })
         }
      })


   }
}
