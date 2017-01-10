module.exports.email = {
	host: 'smtp.office365.com',
	secureConnection: false,
	tls: {
		ciphers: 'SSLv3'
	},
	debug: true,
	service: 'Outlook',
	auth: {
		user: 'shingo.it@usu.edu',
		pass: process.env.SHINGO_IT_PWORD,
	},
	templateDir: 'views/emailTemplates',
	from: 'shingo.it@usu.edu',
}