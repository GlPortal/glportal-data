set ( CSD "${CMAKE_CURRENT_SOURCE_DIR}" )
set ( SHARE_INSTALL_DIR share/glportal )
set ( DATADIR "${SHARE_INSTALL_DIR}/data" )

install ( FILES main.cfg DESTINATION ${DATADIR} )

list ( APPEND DIRS
	audio
	fonts
	maps
	meshes
	shaders
	textures
)

foreach ( DIR IN LISTS DIRS )
	install ( DIRECTORY "${CSD}/${DIR}" DESTINATION ${DATADIR} )
endforeach()