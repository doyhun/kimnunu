import os
import joblib

# xgboost 오류시 -> pip install xgboost

class Process():
    def __init__(self):
        self.get_model_path = f'./data/P_model'
        self.sevel_model = joblib.load(f'{self.get_model_path}/model_SEVEL.pkl')
        self.laco_model = joblib.load(f'{self.get_model_path}/model_LACO.pkl')
        self.velporo_model = joblib.load(f'{self.get_model_path}/model_Velporo.pkl')
     
    def predict(self, input_dic):
        x_vars = ['Phosphorus', 'Ferritin', 'pre_Phosphorus', 'pre_Ferritin', 'pre_SEVEL' ,'pre_LACO', 'pre_Velporo']        
        if input_dic is False:
            return False

        input = [[ input_dic[e] for e in x_vars ]]
        print(input)
        SEVEL = self.sevel_model.predict(input)
        LACO = self.laco_model.predict(input)
        Velporo = self.velporo_model.predict(input)
        input_dic['SEVEL'] = SEVEL
        input_dic['LACO'] = LACO
        input_dic['VELPORO'] = Velporo
        return input_dic
        