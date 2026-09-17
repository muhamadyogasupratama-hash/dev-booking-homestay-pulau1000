class Controller {
    static async landingPage(req, res) {
        try {
            
            res.render('landingPage')
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async landingPageLogin(req, res) {
        try {
            const {email, password} = req.body
            // console.log(email);
            // console.log(password);

            if(email === "uzumaki@konoha.co.id" && password === "Uzumaki") {
                res.redirect('/homestays')


            } else {
                res.send("Login tidak sesuai")
            }
            

        } catch (error) {
            
        }
    }

    static async registerUser(req, res) {
        try {

            res.render('registerUser')
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async registerUserPost(req, res) {
        try {
            const {name, email, password} = req.body

            // console.log(name);
            // console.log(email);
            // console.log(password);

            res.redirect('/')
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async showHomestays (req, res) {
        try {
            res.send("Welcome to Homestay")

        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }

    static async showProfile(req, res) {
        try {
            
        } catch (error) {
            
        }
    }

    
}


module.exports = Controller