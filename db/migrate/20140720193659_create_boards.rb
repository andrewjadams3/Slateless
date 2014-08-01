class CreateBoards < ActiveRecord::Migration
  def change
    create_table :boards do |t|
      t.belongs_to :user
      t.string :url
      t.string :title
      t.json :paths
      t.timestamps
    end
    add_index :boards, :url, :unique => true
  end
end
