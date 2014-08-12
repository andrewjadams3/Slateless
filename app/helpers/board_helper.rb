def new_board(title)
  new_url = ""
  loop do
    new_url = random_url
    break unless Board.exists?(url: new_url)
  end
  Board.new(url: new_url, title: title)
end

def find_board(board_url)
  Board.find_by_url board_url
end

def random_url
  letters = ('1'..'9').to_a + ('A'..'N').to_a + ('P'..'Z').to_a
  random = letters.shuffle[0,6]
  random[0..2].join + "-" + random[3..5].join
end