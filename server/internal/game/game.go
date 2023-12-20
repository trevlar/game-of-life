package game

type Cell struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type GameState struct {
	ID          int      `json:"id"`
	LivingCells []Cell   `json:"livingCells"`
	Board       [][]bool `json:"board"`
	Generations int      `json:"generations"`
	IsPlaying   bool     `json:"isPlaying"`
	Settings    Settings `json:"settings"`
}

type SavedGame struct {
	ID              int       `json:"id"`
	Title           string    `json:"title"`
	LivingCells     []string  `json:"livingCells"`
	Board           *[][]bool `json:"board"`
	VirtualBoard    *[][]bool `json:"virtualBoard"`
	Description     string    `json:"description"`
	Generations     int       `json:"generations"`
	IsPlaying       bool      `json:"isPlaying"`
	LivingCellCount int       `json:"livingCellCount"`
	Settings        *Settings `json:"settings"`
}

type Settings struct {
	BoardSize             *int    `json:"boardSize,omitempty"`
	GameSpeed             *string `json:"gameSpeed,omitempty"`
	GenerationsPerAdvance *int    `json:"generationsPerAdvance,omitempty"`
	WrapAround            *bool   `json:"wrapAround,omitempty"`
}

type SaveGamePayload struct {
	Id              *int     `json:"id"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	LivingCells     []Cell   `json:"livingCells"`
	Board           [][]bool `json:"board"`
	VirtualBoard    [][]bool `json:"virtualBoard"`
	Generations     int      `json:"generations"`
	IsPlaying       bool     `json:"isPlaying"`
	LivingCellCount int      `json:"livingCellCount"`
	Settings        Settings `json:"settings"`
}

type GameProgressPayload struct {
	LivingCells  *[]Cell   `json:"livingCells,omitempty"`
	Board        *[][]bool `json:"board,omitempty"`
	VirtualBoard *[][]bool `json:"virtualBoard,omitempty"`
	Generations  *int      `json:"generations,omitempty"`
	Settings     *Settings `json:"settings,omitempty"`
	Steps        *int      `json:"steps,omitempty"`
	Cell         *Cell     `json:"cell,omitempty"`
}
