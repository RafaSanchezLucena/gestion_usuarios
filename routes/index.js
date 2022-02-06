const express = require("express");
const router = express.Router();
const pool = require("../bd");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;




// Esta instrucción permite que la aplicación reciba los datos
// directamente del formulario.
router.use(express.urlencoded({ extended: true }));

// Configuración de express-session
router.use(cookieParser("misecreto"));
router.use(
  session({
    secret: "misecreto",
    resave: true,
    saveUninitialized: true,
  })
);

// Configuración de passport (siempre debe ir después de la configuración de express-session).
router.use(passport.initialize());
router.use(passport.session());

// Si estamos usando express-local, hay que configurar una estrategia local.
passport.use(
  // Aquí hay que hacer la consulta a la bd para validar al usuario y contraseña.
  new LocalStrategy((username, password, done) => {
    if (username === "21654511b" && password === "1234") {
      //Si es correcto regresa el objeto del Usuario
      return done(null, { username: "21654511b" });
    } else {
      //De lo contrario regresa falso
      return done(null, false);
    }
  })
);

passport.serializeUser((user, done) => {
  //En este caso serializamos el username, pero es preferente usar el _id
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  // Para este ejemplo estamos pasando el objeto User directamente
  done(null, { username: username });
});

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

router.get("/", (req, res) => {
  res.render("./main.html", { titulo: "Gestor" });
});

// Rutas principales
router.get("/form", auth, (req, res) => {
  res.render("./form.html", { titulo: "Gestor" });
});

router.get("/login", (req, res) => {
  res.render("./login.html", { titulo: "Gestor" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/form",
  })
);

//Ruta para cerrar la sesión
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// Las rutas obtienen, añaden, modifican y eliminan los datos de los usuarios,
// siempre que este usuario exista o no, para ello hacemos una llamada previa a la
// función "comprobarSiExisteRegistro", y a continuación se realiza la consulta
// correspondiente a la BD.

const comprobarSiExisteRegistro = (dni) => {
  let sql = "SELECT * FROM alumnos WHERE dni = ?";
  values = dni;
  return new Promise((resolve) => {
    pool.query(sql, values, (err, results, fields) => {
      if (err) {
        console.log(err);
      } else {
        resultado = Object.keys(results).length;
        resolve(resultado);
      }
    });
  });
};

// Mediante esta ruta mostramos el resultado de la consulta del usuario por "dni"
router.get("/user/:dni", (req, res) => {
  let sql = "SELECT * FROM alumnos WHERE dni = ?";
  values = req.params.dni;
  pool.query(sql, values, (err, results, fields) => {
    if (err) {
      console.log(`La consulta ha devuelto un error --> ${err}`);
      // Comprobamos que el resultado de la consulta no es un objeto vacío
    } else if (Object.keys(results).length === 0) {
      res.send("La consulta no ha devuelto ningún resultado.");
      console.log("La consulta no ha devuelto ningún resultado.");
    } else {
      res.send(JSON.stringify(results));
      console.log("Se ha realizado la consulta");
    }
  });
});

// Mediante esta ruta mostramos en pantalla todos los resultados de la tabla en cuestión
router.get("/user", (req, res) => {
  let sql = "SELECT * FROM alumnos";
  pool.query(sql, (err, results, fields) => {
    if (err) {
      console.log(`La consulta ha devuelto un error --> ${err}`);
      // Comprobamos que el resultado de la consulta no es un objeto vacío
    } else if (Object.keys(results).length === 0) {
      res.send("La consulta no ha devuelto ningún resultado.");
      console.log("La consulta no ha devuelto ningún resultado.");
    } else {
      res.send(JSON.stringify(results));
      console.log("Se ha realizado la consulta");
    }
  });
});


// Esta ruta nos permite añadir un nuevo usuario a la tabla
router.post("/user/:dni", async (req, res) => {
  let resultado = await comprobarSiExisteRegistro(req.params.dni);
  if (resultado !== 0) {
    res.send("Ya existe este usuario.");
    console.log("Ya existe este usuario.");
  } else {
    const { dni, nombre, apellido1, apellido2, email, password } = req.body;
    let sql =
      "INSERT INTO alumnos (dni, nombre, apellido1, apellido2, email, password) VALUES (?,?,?,?,?,?)";
    let values = [dni, nombre, apellido1, apellido2, email, password];
    pool.query(sql, values, (err, results, fields) => {
      if (err) {
        console.log(`La consulta ha devuelto un error --> ${err}`);
      } else {
        console.log(`El usuario se ha creado con éxito.`);
        res.send(`El usuario se ha creado con éxito.`);
      }
    });
  }
});

// Mediante esta ruta podemos modificar los datos de un usuario a través de su "dni"
router.put("/user/:dni", async (req, res) => {
  let resultado = await comprobarSiExisteRegistro(req.params.dni);
  if (resultado === 0) {
    res.send("Este usuario no existe.");
    console.log("Este usuario no existe.");
  } else {
    let sql = "UPDATE alumnos SET ? WHERE dni = ?";
    let values = [req.body, req.params.dni];
    pool.query(sql, values, (err, results, fields) => {
      if (err) {
        console.log(`La consulta ha devuelto un error --> ${err}`);
      } else {
        res.send(`El usuario ha sido actualizado con éxito.`);
        console.log(`El usuario ha sido actualizado con éxito.`);
      }
    });
  }
});

// Esta ruta nos permite eliminar un usuario a través de su "dni"
router.delete("/user/:dni", async (req, res) => {
  let resultado = await comprobarSiExisteRegistro(req.params.dni);
  if (resultado === 0) {
    res.send("Este usuario no existe.");
    console.log("Este usuario no existe.");
  } else {
    let sql = "DELETE FROM alumnos WHERE dni = ? ";
    let values = req.params.dni;
    pool.query(sql, values, (err, results, fields) => {
      if (err) {
        console.log(`La consulta ha devuelto un error --> ${err}`);
      } else {
        console.log(`El usuario ha sido eliminado con éxito.`);
        res.send(`El usuario ha sido eliminado con éxito.`);
      }
    });
  }
});

module.exports = router;
