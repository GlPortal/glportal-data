set ( CSD "${CMAKE_CURRENT_SOURCE_DIR}" )
set ( SHARE_INSTALL_DIR share/glportal )
set ( DATADIR "${SHARE_INSTALL_DIR}/data" )

install (FILES config.json DESTINATION ${DATADIR})

list ( APPEND DIRS
	audio
	fonts
	maps
	screens
	meshes
	shaders
	textures
)

foreach ( DIR IN LISTS DIRS )
	install ( DIRECTORY "${CSD}/${DIR}" DESTINATION ${DATADIR} )
endforeach()
