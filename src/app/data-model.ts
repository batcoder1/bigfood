export class Food {
  id = 0;
  name = '';
  description = '';
  amount = 0;
  unit= '';
  calories= 0;
  macros: Macros;
}

export class Macros {
  protein   = 0;
  fat = 0;
  hc = 0;
}
export class User {
     id= 0;
     name= '';
     foto= '';
     birthday= '';
     height= 0;
     weight= 0;
     country= '';
     postalCode= '';
     units: Units;
     email= '';
     objetivos: Goals;
     meals: Meal[];
}
export class Profile {
      username: string;
      imageUrl: string  ;
      email: string;
      birthday: '';
      height: 0;
      weight: 0;
      country: '';
      postalCode: '';
}

export class Units {
      weight= '';
      height= '';
      distance= '';
      Energy= '';
      water= '';
}
export class Goals {
  initialWeight= 0;
  currentWeight= 0;
  desireWeight= 0;
  weeklyGoal= 0;
  activityLevel= 0;
}

export class DietDays {
  fecha: '';
  meals: Meal[];
}

export class Meal {
  name = '';
  foods: Food[];
}

export const units = ['grs', 'kg', 'unit', 'l', 'ml'];