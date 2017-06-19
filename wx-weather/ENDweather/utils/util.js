function formatTime( date ) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [ year, month, day ].map( formatNumber ).join( '/' ) + ' ' + [ hour, minute, second ].map( formatNumber ).join( ':' )
}

function formatNumber( n ) {
  n = n.toString()
  return n[ 1 ] ? n : '0' + n
}

function getLoc( callback ) {
  wx.getLocation( {
    type: 'wgs84',
    success: function( res ) {
      callback( res )
    }
  })
}

function stripTags( str, r_str = "" ) {
  //去掉所有的html标记
  return str.replace( /<[^>]+>/g, r_str );
}

module.exports = {
  formatTime: formatTime,
  getLoc: getLoc,
  stripTags: stripTags
}
