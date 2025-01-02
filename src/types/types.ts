export interface CarScrappedData {
  name: string;
  price: string;
  hp: string;
  accel: string;
  length: string;
  weight: string;
  trunk_space_seats: string;
  trunk_space_no_seats: string;
  fuel_tank: string;
  url: string;
}

export interface CompItem {
  id: number;
  price: any;
  hp: any;
  accel: any;
  weight: any;
}

export type Database = {
  public: {
    tables: {
      CarDetails: {
        Row: CarScrappedData; // Type for the rows in the table
        Insert: Omit<CarScrappedData, "id">; // For inserting rows
        Update: Partial<CarScrappedData>; // For updating rows
      };
    };
  };
};
