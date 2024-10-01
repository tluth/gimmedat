type IconProps = {
  color: string
  altColor: string
}

function UploadIcon({ color, altColor }: IconProps) {
  return (
    <svg
      id="upload-icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="w-40 h-40 mx-auto overflow-hidden"
      viewBox="0 0 40 40"
    //   enable-background="new 0 0 40 40"
    //   xmlSpace="preserve"
    >
      <g>
        <g>
          <g>
            <g>
              <path
                fill={color}
                d="M26.1,23H25c-0.3,0-0.5-0.2-0.5-0.5S24.7,22,25,22h1.1c0.4,0,0.8-0.2,1.1-0.5c0.3-0.3,0.4-0.7,0.3-1.2
					c-0.1-0.5-0.6-1-1.2-1.1l-0.6-0.1c-0.7-0.1-1.1-0.8-1-1.4l0.1-0.7c0-0.2,0-0.3,0-0.4c0-0.8-0.3-1.5-0.8-2s-1.3-0.8-2-0.8
					c-1,0-2,0.7-2.4,1.7l-0.2,0.4c-0.2,0.5-0.7,0.8-1.3,0.7l-0.5-0.1c-0.9-0.1-1.9,0.5-2.2,1.4l-0.1,0.4c-0.2,0.5-0.5,0.8-1,0.8
					l-0.5,0.1c-0.4,0.1-0.8,0.3-1,0.7c-0.2,0.4-0.3,0.8-0.1,1.2c0.2,0.5,0.8,0.9,1.4,0.9h1c0.3,0,0.5,0.2,0.5,0.5S15.3,23,15,23h-1
					c-1.1,0-2-0.6-2.3-1.6c-0.2-0.7-0.2-1.4,0.2-2c0.4-0.6,1-1,1.7-1.1l0.5-0.1c0.1,0,0.2-0.1,0.2-0.2l0.1-0.4
					c0.4-1.2,1.6-2.1,2.9-2.1c0.1,0,0.2,0,0.3,0l0.5,0.1c0.1,0,0.2,0,0.3-0.1l0.2-0.4c0.6-1.3,1.9-2.2,3.3-2.3c1,0,2,0.3,2.8,1
					c0.7,0.7,1.2,1.7,1.2,2.7c0,0.2,0,0.4-0.1,0.6l-0.1,0.7c0,0.1,0.1,0.3,0.2,0.3l0.6,0.1c1,0.2,1.8,0.9,2,1.9c0.1,0.7,0,1.4-0.5,2
					C27.5,22.7,26.8,23,26.1,23z"
              />
            </g>
            <g>
              <g>
                <path
                  fill={altColor}
                  d="M21.5,24.1c-0.1,0-0.3,0-0.4-0.1L20,22.8l-1.2,1.2c-0.2,0.2-0.5,0.2-0.7,0s-0.2-0.5,0-0.7l1.5-1.5
						c0.2-0.2,0.5-0.2,0.7,0l1.5,1.5c0.2,0.2,0.2,0.5,0,0.7C21.8,24,21.7,24.1,21.5,24.1z"
                />
              </g>
              <g>
                <path
                  fill={altColor}
                  d="M20,27.6c-0.3,0-0.5-0.2-0.5-0.5v-5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v5
						C20.5,27.3,20.3,27.6,20,27.6z"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default UploadIcon
