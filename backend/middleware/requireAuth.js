export function requireAuth(req, res, next) {

  if (req.session.userId){
    return next(); // excecutes next() function after afailed to connect
  }

  console.log('An unathourised user tried to do stuff, Access to protected route blocked')
  return res.status(401).json({ error: 'Authentication required' })
}