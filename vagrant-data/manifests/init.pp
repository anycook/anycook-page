exec { "apt-get update" :
	path => "/usr/bin",
}

# Class:  apache2
# install and starts apache2
#
class  apache2 {
	package { "apache2":
		ensure => present,
		require => Exec["apt-get update"],
	}

	service { "apache2":
	    enable => true,
		ensure => running,
		#hasrestart => true,
		#hasstatus => true,
		require => Package["apache2"],
	}
}

include apache2
